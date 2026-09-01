-- ============================================================================
-- GM Wellness Ops — database schema
-- Run this once in Supabase: Dashboard → SQL Editor → paste → Run.
-- Safe to re-run (idempotent where practical).
-- ============================================================================

-- ---------- PROFILES (one row per auth user, holds the role) -----------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null default 'Member',
  email      text,
  role       text not null default 'staff' check (role in ('admin','staff')),
  created_at timestamptz not null default now()
);

-- ---------- CATALOG ----------------------------------------------------------
create table if not exists public.ingredients (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  category           text not null default 'Extras',
  unit               text not null default 'g',            -- g | ml | pcs
  packet_size        numeric not null default 1000,        -- units per packet
  coffees_per_packet numeric not null default 50,          -- cups one packet yields
  stock              numeric not null default 0,           -- current units on hand
  par                numeric not null default 1000,        -- target/full level
  created_at         timestamptz not null default now()
);

create table if not exists public.products (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  price      numeric not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.recipe_items (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete restrict,
  qty           numeric not null default 0                -- units of this ingredient per cup
);
create index if not exists recipe_items_product_idx on public.recipe_items(product_id);

-- ---------- ACTIVITY ---------------------------------------------------------
create table if not exists public.sales (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  price      numeric not null default 0,
  sold_by    uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists sales_created_idx on public.sales(created_at);

create table if not exists public.issues (
  id            uuid primary key default gen_random_uuid(),
  ingredient_id uuid references public.ingredients(id) on delete set null,
  amount        numeric not null default 0,               -- as entered
  mode          text not null default 'coffees',          -- coffees | units
  units         numeric not null default 0,               -- resolved base units removed
  reason        text,
  logged_by     uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);
create index if not exists issues_created_idx on public.issues(created_at);

-- ---------- SHOP SETTINGS (single row) ---------------------------------------
create table if not exists public.shop_settings (
  id        int primary key default 1 check (id = 1),
  shop_name text not null default 'GM Wellness',
  currency  text not null default 'INR'
);
insert into public.shop_settings (id) values (1) on conflict (id) do nothing;

-- ============================================================================
-- HELPERS
-- ============================================================================
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- New auth user → create a profile. First ever user becomes admin; the admin
-- "Add team member" flow passes an explicit role in user metadata.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_first boolean; v_role text;
begin
  select count(*) = 0 into v_first from public.profiles;
  v_role := coalesce(new.raw_user_meta_data->>'role',
                     case when v_first then 'admin' else 'staff' end);
  insert into public.profiles (id, name, email, role)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
          new.email,
          v_role)
  on conflict (id) do update
    set name = excluded.name, email = excluded.email, role = excluded.role;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- TRANSACTIONAL RPCs (run with elevated rights so staff never write stock directly)
-- ============================================================================

-- Sell one cup: verify stock for every recipe ingredient, decrement, log sale.
create or replace function public.record_sale(p_product_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_sale uuid; v_price numeric; r record;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select price into v_price from public.products where id = p_product_id;
  if v_price is null then raise exception 'Product not found'; end if;

  for r in
    select ri.qty, i.stock, i.name
    from public.recipe_items ri
    join public.ingredients i on i.id = ri.ingredient_id
    where ri.product_id = p_product_id
    for update of i
  loop
    if r.stock < r.qty then
      raise exception 'Not enough %', r.name using errcode = 'P0001';
    end if;
  end loop;

  update public.ingredients i
    set stock = i.stock - ri.qty
    from public.recipe_items ri
    where ri.ingredient_id = i.id and ri.product_id = p_product_id;

  insert into public.sales (product_id, price, sold_by)
  values (p_product_id, v_price, auth.uid())
  returning id into v_sale;
  return v_sale;
end $$;

-- Reverse a sale: restore stock, delete the sale (own sale, or any if admin).
create or replace function public.undo_sale(p_sale_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_pid uuid; v_owner uuid;
begin
  select product_id, sold_by into v_pid, v_owner from public.sales where id = p_sale_id;
  if v_pid is null then raise exception 'Sale not found'; end if;
  if not (v_owner = auth.uid() or public.is_admin()) then raise exception 'Not allowed'; end if;

  update public.ingredients i
    set stock = i.stock + ri.qty
    from public.recipe_items ri
    where ri.ingredient_id = i.id and ri.product_id = v_pid;

  delete from public.sales where id = p_sale_id;
end $$;

-- Log a loss/waste issue and correct stock.
create or replace function public.log_issue(
  p_ingredient_id uuid, p_amount numeric, p_mode text, p_reason text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_units numeric; v_id uuid; r record;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select packet_size, coffees_per_packet, stock into r
    from public.ingredients where id = p_ingredient_id;
  if not found then raise exception 'Ingredient not found'; end if;

  if p_mode = 'coffees' then
    v_units := p_amount * (r.packet_size / nullif(r.coffees_per_packet, 0));
  else
    v_units := p_amount;
  end if;

  update public.ingredients set stock = greatest(0, stock - v_units)
    where id = p_ingredient_id;

  insert into public.issues (ingredient_id, amount, mode, units, reason, logged_by)
  values (p_ingredient_id, p_amount, p_mode, round(v_units), p_reason, auth.uid())
  returning id into v_id;
  return v_id;
end $$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles      enable row level security;
alter table public.ingredients   enable row level security;
alter table public.products      enable row level security;
alter table public.recipe_items  enable row level security;
alter table public.sales         enable row level security;
alter table public.issues        enable row level security;
alter table public.shop_settings enable row level security;

-- Everyone signed in can READ the shop's data.
do $$
declare t text;
begin
  foreach t in array array['profiles','ingredients','products','recipe_items','sales','issues','shop_settings']
  loop
    execute format('drop policy if exists "read %1$s" on public.%1$s;', t);
    execute format('create policy "read %1$s" on public.%1$s for select to authenticated using (true);', t);
  end loop;
end $$;

-- Only ADMINS can change the catalog and settings.
do $$
declare t text;
begin
  foreach t in array array['ingredients','products','recipe_items','shop_settings']
  loop
    execute format('drop policy if exists "write %1$s" on public.%1$s;', t);
    execute format('create policy "write %1$s" on public.%1$s for all to authenticated using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- Admins can change roles in profiles (create/delete of users happens via the
-- admin-users Edge Function using the service role).
drop policy if exists "admin update profiles" on public.profiles;
create policy "admin update profiles" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- sales & issues are written only through the SECURITY DEFINER RPCs above,
-- so they need no INSERT policy here (reads are allowed by "read ..." above).

-- ============================================================================
-- GRANTS
-- ============================================================================
grant execute on function public.record_sale(uuid)            to authenticated;
grant execute on function public.undo_sale(uuid)              to authenticated;
grant execute on function public.log_issue(uuid,numeric,text,text) to authenticated;
grant execute on function public.is_admin()                   to authenticated;
