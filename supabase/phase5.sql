-- ============================================================================
-- GM Wellness Ops - Phase 5 : multiple branches
--
-- Run ONCE in Supabase -> SQL Editor, after phase4.sql. Idempotent.
--
-- Model chosen: EVERY BRANCH IS FULLY INDEPENDENT.
--   Each branch owns its own drinks, recipes, supplies, extras, stock, orders
--   and its own GST identity (GSTIN, address, state, invoice series). A new
--   branch is created by COPYING an existing one, after which the two drift
--   apart freely.
--
--   Staff belong to exactly one branch and can only ever see that branch.
--   Admins (owners) can see and switch between all branches.
--   A staff member with no branch assigned cannot sell at all.
--
-- Existing data is moved into a first branch named 'GM Wellness'.
-- ============================================================================

begin;

-- ---------------------------------------------------------------- branches
create table if not exists public.branches (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  code           text,                       -- short tag, e.g. KOR
  -- GST identity is per branch: registration is state-wise in India
  legal_name     text,
  gstin          text,
  address        text,
  state          text,
  phone          text,
  fssai          text,
  invoice_prefix text    not null default 'GMW',
  gst_rate       numeric not null default 5,
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);
create unique index if not exists branches_name_key on public.branches(lower(name));

-- ------------------------------------------------- seed the existing branch
-- Everything that exists today belongs to one outlet; carry its GST details
-- over from shop_settings so nothing changes on the bills.
insert into public.branches (name, code, legal_name, gstin, address, state, phone, fssai, invoice_prefix, gst_rate)
select 'GM Wellness', 'MAIN', s.legal_name, s.gstin, s.address, s.state, s.phone, s.fssai,
       coalesce(s.invoice_prefix,'GMW'), coalesce(s.gst_rate,5)
from public.shop_settings s where s.id = 1
on conflict do nothing;

-- fallback if shop_settings had no row at all
insert into public.branches (name, code)
select 'GM Wellness', 'MAIN'
where not exists (select 1 from public.branches)
on conflict do nothing;

-- --------------------------------------------------- branch_id everywhere
alter table public.profiles      add column if not exists branch_id uuid references public.branches(id) on delete set null;
alter table public.ingredients   add column if not exists branch_id uuid references public.branches(id) on delete cascade;
alter table public.products      add column if not exists branch_id uuid references public.branches(id) on delete cascade;
alter table public.recipe_items  add column if not exists branch_id uuid references public.branches(id) on delete cascade;
alter table public.extras        add column if not exists branch_id uuid references public.branches(id) on delete cascade;
alter table public.extra_products add column if not exists branch_id uuid references public.branches(id) on delete cascade;
alter table public.orders        add column if not exists branch_id uuid references public.branches(id) on delete cascade;
alter table public.issues        add column if not exists branch_id uuid references public.branches(id) on delete cascade;
alter table public.discount_log  add column if not exists branch_id uuid references public.branches(id) on delete cascade;

-- backfill everything that exists today onto the first branch
do $$
declare b uuid;
begin
  select id into b from public.branches order by created_at limit 1;
  update public.ingredients    set branch_id=b where branch_id is null;
  update public.products       set branch_id=b where branch_id is null;
  update public.recipe_items   set branch_id=b where branch_id is null;
  update public.extras         set branch_id=b where branch_id is null;
  update public.extra_products set branch_id=b where branch_id is null;
  update public.orders         set branch_id=b where branch_id is null;
  update public.issues         set branch_id=b where branch_id is null;
  update public.discount_log   set branch_id=b where branch_id is null;
  -- existing admins keep company-wide access (branch_id stays null);
  -- existing staff are pinned to the first branch so they can keep working
  update public.profiles set branch_id=b where branch_id is null and role <> 'admin';
end $$;

-- now that nothing is null, make it required on the data tables
do $$
declare t text;
begin
  foreach t in array array['ingredients','products','recipe_items','extras','extra_products','orders','issues'] loop
    execute format('alter table public.%I alter column branch_id set not null', t);
  end loop;
end $$;

create index if not exists ingredients_branch_idx  on public.ingredients(branch_id);
create index if not exists products_branch_idx     on public.products(branch_id);
create index if not exists extras_branch_idx       on public.extras(branch_id);
create index if not exists issues_branch_idx       on public.issues(branch_id);
create index if not exists orders_branch_date_idx  on public.orders(branch_id, created_at desc);

-- ------------------------------------------- invoice counters, now per branch
alter table public.invoice_counters add column if not exists branch_id uuid references public.branches(id) on delete cascade;
do $$
declare b uuid;
begin
  select id into b from public.branches order by created_at limit 1;
  update public.invoice_counters set branch_id=b where branch_id is null;
end $$;
do $$
declare c text;
begin
  select conname into c from pg_constraint
   where conrelid='public.invoice_counters'::regclass and contype='p';
  if c is not null then execute format('alter table public.invoice_counters drop constraint %I', c); end if;
end $$;
alter table public.invoice_counters alter column branch_id set not null;
alter table public.invoice_counters add constraint invoice_counters_pkey primary key (branch_id, fy);

-- ---------------------------------------------------------- helper functions
create or replace function public.my_branch_id()
 returns uuid language sql stable security definer set search_path to 'public'
as $function$ select branch_id from public.profiles where id = auth.uid() $function$;

-- Admins reach every branch; everyone else only their own.
create or replace function public.can_access_branch(p_branch uuid)
 returns boolean language sql stable security definer set search_path to 'public'
as $function$
  select p_branch is not null
     and (public.is_admin() or p_branch = public.my_branch_id())
$function$;

grant execute on function public.my_branch_id()          to authenticated;
grant execute on function public.can_access_branch(uuid) to authenticated;

-- ---------------------------------------------------------------- audit log
create table if not exists public.admin_audit (
  id          uuid primary key default gen_random_uuid(),
  action      text not null,
  branch_id   uuid,
  branch_name text,
  details     jsonb not null default '{}'::jsonb,
  done_by     uuid,
  done_by_name text,
  created_at  timestamptz not null default now()
);
alter table public.admin_audit enable row level security;
drop policy if exists admin_audit_read on public.admin_audit;
create policy admin_audit_read on public.admin_audit
  for select to authenticated using (public.is_admin());
-- append-only: no insert/update/delete policy; only the functions below write.

-- ---------------------------------------------------------------- RLS rework
-- Reads are scoped to the caller's branch; admins see everything.
-- Writes stay admin-only, except orders/order_items which are RPC-only (phase3).
do $$
declare t text;
begin
  foreach t in array array['ingredients','products','recipe_items','extras','extra_products','issues','orders'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "read %1$s" on public.%1$s', t);
    execute format(
      'create policy "read %1$s" on public.%1$s for select to authenticated
         using (public.is_admin() or branch_id = public.my_branch_id())', t);
  end loop;

  -- admin write policies, branch-scoped for tidiness
  foreach t in array array['ingredients','products','recipe_items','extras','extra_products'] loop
    execute format('drop policy if exists "write %1$s" on public.%1$s', t);
    execute format(
      'create policy "write %1$s" on public.%1$s for all to authenticated
         using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- order_items has no branch_id of its own; scope it through its order
alter table public.order_items enable row level security;
drop policy if exists "read order_items" on public.order_items;
create policy "read order_items" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o
                 where o.id = order_items.order_id
                   and (public.is_admin() or o.branch_id = public.my_branch_id())));

-- branches: everyone signed in can read (the till needs its own GST details);
-- only admins may change them.
alter table public.branches enable row level security;
drop policy if exists "read branches"  on public.branches;
drop policy if exists "write branches" on public.branches;
create policy "read branches"  on public.branches for select to authenticated using (true);
create policy "write branches" on public.branches for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- invoice_counters + discount_log
alter table public.invoice_counters enable row level security;
drop policy if exists "read invoice_counters" on public.invoice_counters;
create policy "read invoice_counters" on public.invoice_counters for select to authenticated
  using (public.is_admin() or branch_id = public.my_branch_id());

drop policy if exists discount_log_read on public.discount_log;
create policy discount_log_read on public.discount_log
  for select to authenticated using (public.is_admin());

commit;

-- ============================================================================
-- Part B : branch-aware RPCs
-- ============================================================================
begin;

-- ---------------------------------------------------------------- record_order
-- Now takes p_payload->>'branch_id'. GST identity and the invoice series come
-- from that branch, not from shop_settings.
create or replace function public.record_order(p_payload jsonb)
 returns uuid
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_short text; v_rate numeric; v_prefix text; v_cap numeric; v_branch uuid;
  v_year int; v_month int; v_fy text; v_seq int; v_inv text;
  v_order uuid; v_gross numeric := 0;
  v_total numeric; v_taxable numeric; v_tax numeric; v_cgst numeric; v_sgst numeric;
  it jsonb; v_pid uuid; v_qty int; v_pp numeric; v_pname text;
  v_extras jsonb; v_extra_sum numeric; v_line numeric; v_recipe jsonb;
  v_disc numeric := 0; v_disc_pct numeric; v_reason text; v_cust text;
  v_is_admin boolean; v_me uuid; v_myname text; v_myrole text; v_eff_pct numeric;
  v_pin text; v_hash text; v_over boolean := false; v_override_by uuid;
begin
  v_me := auth.uid();
  if v_me is null then raise exception 'Not authenticated'; end if;
  if jsonb_array_length(coalesce(p_payload->'items','[]'::jsonb)) = 0 then
    raise exception 'Cart is empty'; end if;

  v_branch := nullif(p_payload->>'branch_id','')::uuid;
  if v_branch is null then v_branch := public.my_branch_id(); end if;
  if v_branch is null then
    raise exception 'No branch selected - ask an owner to assign you to a branch';
  end if;
  if not public.can_access_branch(v_branch) then
    raise exception 'You do not have access to that branch';
  end if;

  select gst_rate, invoice_prefix into v_rate, v_prefix from public.branches where id = v_branch;
  v_rate := coalesce(v_rate,5); v_prefix := coalesce(v_prefix,'GMW');
  select coalesce(max_staff_discount_pct,15) into v_cap from public.shop_settings where id=1;
  v_cap := coalesce(v_cap,15);

  v_is_admin := public.is_admin();
  select name, role into v_myname, v_myrole from public.profiles where id = v_me;

  -- 1) check stock, within this branch only
  with items as (
    select (t.it->>'product_id')::uuid pid, coalesce((t.it->>'qty')::int,1) qty, t.it->'extras' extras
    from jsonb_array_elements(p_payload->'items') as t(it)
  ),
  recipe_need as (
    select ri.ingredient_id, sum(ri.qty*i.qty) need
    from items i join public.recipe_items ri on ri.product_id=i.pid group by ri.ingredient_id
  ),
  extra_need as (
    select e.ingredient_id, sum(e.qty*i.qty) need
    from items i, jsonb_array_elements_text(coalesce(i.extras,'[]'::jsonb)) ex(eid)
    join public.extras e on e.id = ex.eid::uuid
    group by e.ingredient_id
  ),
  need as (select ingredient_id, sum(need) need from (
    select * from recipe_need union all select * from extra_need) u group by ingredient_id)
  select string_agg(ing.name, ', ') into v_short
  from need join public.ingredients ing on ing.id = need.ingredient_id
  where ing.stock < need.need;
  if v_short is not null then raise exception 'Not enough stock: %', v_short; end if;

  -- every line must belong to this branch
  if exists (
    select 1 from jsonb_array_elements(p_payload->'items') as t(it)
    join public.products p on p.id = (t.it->>'product_id')::uuid
    where p.branch_id <> v_branch
  ) then raise exception 'That order mixes drinks from another branch'; end if;

  -- ...and so must every extra. Without this, an order at one branch could
  -- name another branch's extra and draw stock down at that other branch.
  if exists (
    select 1
    from jsonb_array_elements(p_payload->'items') as t(it)
    cross join lateral jsonb_array_elements_text(coalesce(t.it->'extras','[]'::jsonb)) as ex(eid)
    join public.extras e on e.id = ex.eid::uuid
    where e.branch_id <> v_branch
  ) then raise exception 'That order uses an extra from another branch'; end if;

  -- 2) decrement stock
  with items as (
    select (t.it->>'product_id')::uuid pid, coalesce((t.it->>'qty')::int,1) qty, t.it->'extras' extras
    from jsonb_array_elements(p_payload->'items') as t(it)
  ),
  recipe_need as (
    select ri.ingredient_id, sum(ri.qty*i.qty) need
    from items i join public.recipe_items ri on ri.product_id=i.pid group by ri.ingredient_id
  ),
  extra_need as (
    select e.ingredient_id, sum(e.qty*i.qty) need
    from items i, jsonb_array_elements_text(coalesce(i.extras,'[]'::jsonb)) ex(eid)
    join public.extras e on e.id = ex.eid::uuid group by e.ingredient_id
  ),
  need as (select ingredient_id, sum(need) need from (
    select * from recipe_need union all select * from extra_need) u group by ingredient_id)
  update public.ingredients i set stock = i.stock - need.need
  from need where need.ingredient_id = i.id;

  -- 3) invoice number: its own series per branch, per Indian FY (Apr-Mar)
  v_year := extract(year from now())::int; v_month := extract(month from now())::int;
  if v_month < 4 then v_fy := (v_year-1)::text || '-' || right(v_year::text,2);
  else v_fy := v_year::text || '-' || right((v_year+1)::text,2); end if;
  insert into public.invoice_counters(branch_id,fy,last_no) values(v_branch,v_fy,1)
    on conflict (branch_id,fy) do update set last_no = public.invoice_counters.last_no + 1
    returning last_no into v_seq;
  v_inv := v_prefix || '/' || v_fy || '/' || lpad(v_seq::text,4,'0');

  -- 4) create order shell
  insert into public.orders(invoice_no,payment_mode,order_type,sold_by,branch_id)
    values(v_inv, p_payload->>'payment_mode', p_payload->>'order_type', v_me, v_branch)
    returning id into v_order;

  -- 5) items (+ snapshot extras AND the recipe actually used)
  for it in select * from jsonb_array_elements(p_payload->'items') loop
    v_pid := (it->>'product_id')::uuid; v_qty := coalesce((it->>'qty')::int,1);
    select price, name into v_pp, v_pname from public.products where id=v_pid;
    if v_pp is null then raise exception 'Product not found'; end if;

    select coalesce(jsonb_agg(jsonb_build_object('name',e.name,'price',e.price,'ingredient_id',e.ingredient_id,'qty',e.qty)),'[]'::jsonb),
           coalesce(sum(e.price),0)
      into v_extras, v_extra_sum
      from jsonb_array_elements_text(coalesce(it->'extras','[]'::jsonb)) ex(eid)
      join public.extras e on e.id = ex.eid::uuid;

    select coalesce(jsonb_agg(jsonb_build_object('ingredient_id',ri.ingredient_id,'qty',ri.qty)),'[]'::jsonb)
      into v_recipe from public.recipe_items ri where ri.product_id = v_pid;

    v_line := (v_pp + v_extra_sum) * v_qty;
    v_gross := v_gross + v_line;
    insert into public.order_items(order_id,product_id,product_name,qty,unit_price,extras,line_total,recipe_snapshot)
      values(v_order, v_pid, v_pname, v_qty, v_pp, v_extras, v_line, v_recipe);
  end loop;

  -- 6) discount - validated server side
  v_disc_pct := nullif(p_payload->>'discount_pct','')::numeric;
  v_disc     := coalesce(nullif(p_payload->>'discount_amount','')::numeric, 0);
  v_reason   := nullif(btrim(coalesce(p_payload->>'discount_reason','')),'');
  v_cust     := nullif(btrim(coalesce(p_payload->>'customer_name','')),'');
  v_pin      := nullif(btrim(coalesce(p_payload->>'override_pin','')),'');

  if v_disc <= 0 and coalesce(v_disc_pct,0) > 0 then
    v_disc := round(v_gross * v_disc_pct / 100.0, 2);
  end if;
  if v_disc < 0 then v_disc := 0; end if;
  if v_disc > v_gross then raise exception 'Discount cannot exceed the order value'; end if;

  if v_disc > 0 then
    v_eff_pct := round(v_disc / nullif(v_gross,0) * 100.0, 2);
    if v_reason is null then raise exception 'A reason is required for every discount'; end if;
    if v_eff_pct > v_cap then
      v_over := true;
      if not v_is_admin then
        if v_pin is null then
          raise exception 'A discount of % percent is over the % percent limit - a manager override PIN is required', v_eff_pct, v_cap;
        end if;
        select override_pin_hash into v_hash from public.shop_secrets where id = 1;
        if v_hash is null then
          raise exception 'No manager override PIN has been set yet - an owner can set one in Admin, Settings';
        end if;
        if extensions.crypt(v_pin, v_hash) <> v_hash then
          raise exception 'That override PIN is not correct';
        end if;
        v_override_by := v_me;
      end if;
    end if;
    if v_disc_pct is null then v_disc_pct := v_eff_pct; end if;
  else
    v_disc_pct := null; v_reason := null;
  end if;

  -- 7) GST on the discounted value
  v_total   := round(v_gross - v_disc);
  v_taxable := round(v_total / (1 + v_rate/100.0), 2);
  v_tax     := round(v_total - v_taxable, 2);
  v_cgst    := round(v_tax/2.0, 2); v_sgst := v_tax - v_cgst;

  update public.orders set
    gross=v_gross, total=v_total, taxable=v_taxable, tax=v_tax, cgst=v_cgst, sgst=v_sgst,
    round_off = round(v_total - (v_gross - v_disc), 2),
    discount_amount = v_disc, discount_pct = v_disc_pct, discount_reason = v_reason,
    discount_by = case when v_disc > 0 then v_me end,
    discount_by_name = case when v_disc > 0 then coalesce(v_myname,'-') end,
    customer_name = v_cust, over_limit = v_over, override_by = v_override_by
  where id = v_order;

  if v_disc > 0 then
    insert into public.discount_log(order_id,invoice_no,gross,discount_amount,discount_pct,
                                    reason,customer_name,given_by,given_by_name,given_by_role,branch_id)
    values (v_order, v_inv, v_gross, v_disc, v_disc_pct,
            case when v_over then '[OVER LIMIT] ' || v_reason else v_reason end,
            v_cust, v_me, coalesce(v_myname,'-'), coalesce(v_myrole,'-'), v_branch);
  end if;

  return v_order;
end $function$;

-- ---------------------------------------------------------------- log_issue
-- branch comes from the ingredient; staff can only touch their own branch.
create or replace function public.log_issue(p_ingredient_id uuid, p_amount numeric, p_mode text, p_reason text)
 returns uuid language plpgsql security definer set search_path to 'public'
as $function$
declare v_units numeric; v_id uuid; r record;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select packet_size, coffees_per_packet, stock, branch_id into r
    from public.ingredients where id = p_ingredient_id;
  if not found then raise exception 'Ingredient not found'; end if;
  if not public.can_access_branch(r.branch_id) then
    raise exception 'That supply belongs to another branch'; end if;

  if p_mode = 'coffees' then
    v_units := p_amount * (r.packet_size / nullif(r.coffees_per_packet, 0));
  else
    v_units := p_amount;
  end if;

  update public.ingredients set stock = greatest(0, stock - v_units)
    where id = p_ingredient_id;

  insert into public.issues (ingredient_id, amount, mode, units, reason, logged_by, branch_id)
  values (p_ingredient_id, p_amount, p_mode, round(v_units), p_reason, auth.uid(), r.branch_id)
  returning id into v_id;
  return v_id;
end $function$;

-- ---------------------------------------------------------------- cancel_order
create or replace function public.cancel_order(p_order_id uuid, p_reason text)
 returns void language plpgsql security definer set search_path to 'public'
as $function$
declare
  v_ts timestamptz; v_status text; v_branch uuid; oi record; ex jsonb; rs jsonb;
  v_me uuid; v_myname text; v_reason text;
begin
  v_me := auth.uid();
  if v_me is null then raise exception 'Not authenticated'; end if;
  v_reason := nullif(btrim(coalesce(p_reason,'')),'');
  if v_reason is null then raise exception 'A reason is required to cancel an invoice'; end if;

  select created_at, status, branch_id into v_ts, v_status, v_branch
    from public.orders where id = p_order_id;
  if v_ts is null then raise exception 'Order not found'; end if;
  if not public.can_access_branch(v_branch) then
    raise exception 'That invoice belongs to another branch'; end if;
  if v_status = 'cancelled' then raise exception 'This invoice is already cancelled'; end if;
  if not (public.is_admin() or v_ts > now() - interval '24 hours') then
    raise exception 'Orders can only be cancelled within 24 hours'; end if;

  select name into v_myname from public.profiles where id = v_me;

  for oi in select * from public.order_items where order_id = p_order_id loop
    if jsonb_array_length(coalesce(oi.recipe_snapshot,'[]'::jsonb)) > 0 then
      for rs in select * from jsonb_array_elements(oi.recipe_snapshot) loop
        update public.ingredients i set stock = i.stock + coalesce((rs->>'qty')::numeric,0) * oi.qty
          where i.id = (rs->>'ingredient_id')::uuid;
      end loop;
    else
      update public.ingredients i set stock = i.stock + ri.qty * oi.qty
        from public.recipe_items ri
        where ri.product_id = oi.product_id and ri.ingredient_id = i.id;
    end if;
    for ex in select * from jsonb_array_elements(coalesce(oi.extras,'[]'::jsonb)) loop
      if (ex->>'ingredient_id') is not null then
        update public.ingredients i set stock = i.stock + coalesce((ex->>'qty')::numeric,0) * oi.qty
          where i.id = (ex->>'ingredient_id')::uuid;
      end if;
    end loop;
  end loop;

  update public.orders set
    status='cancelled', cancelled_at=now(), cancelled_by=v_me,
    cancelled_by_name=coalesce(v_myname,'-'), cancel_reason=v_reason
  where id = p_order_id;
end $function$;

commit;

-- ============================================================================
-- Part C : create a branch (optionally by copying another) and wipe a branch
-- ============================================================================
begin;

-- ---------------------------------------------------------------- create_branch
-- Copies drinks, recipes, supplies and extras from p_copy_from, with stock
-- reset to zero. Pass null to start empty.
create or replace function public.create_branch(
    p_name text, p_code text default null, p_copy_from uuid default null,
    p_invoice_prefix text default null)
 returns uuid language plpgsql security definer set search_path to 'public'
as $function$
declare v_id uuid; v_name text; v_me uuid; v_myname text;
begin
  v_me := auth.uid();
  if v_me is null then raise exception 'Not authenticated'; end if;
  if not public.is_admin() then raise exception 'Only an owner can add a branch'; end if;

  v_name := nullif(btrim(coalesce(p_name,'')),'');
  if v_name is null then raise exception 'The branch needs a name'; end if;
  if exists (select 1 from public.branches where lower(name)=lower(v_name)) then
    raise exception 'A branch called "%" already exists', v_name; end if;

  insert into public.branches(name, code, invoice_prefix)
  values (v_name, nullif(btrim(coalesce(p_code,'')),''),
          coalesce(nullif(btrim(coalesce(p_invoice_prefix,'')),''),'GMW'))
  returning id into v_id;

  if p_copy_from is not null then
    if not exists (select 1 from public.branches where id=p_copy_from) then
      raise exception 'The branch to copy from was not found'; end if;

    create temp table _ing_map(old_id uuid, new_id uuid) on commit drop;
    create temp table _prod_map(old_id uuid, new_id uuid) on commit drop;
    create temp table _extra_map(old_id uuid, new_id uuid) on commit drop;

    -- supplies (stock starts at zero; the new branch has nothing on hand yet)
    with src as (select *, gen_random_uuid() new_id from public.ingredients where branch_id=p_copy_from),
    ins as (
      insert into public.ingredients(id,branch_id,name,category,unit,packet_size,coffees_per_packet,stock,par)
      select new_id,v_id,name,category,unit,packet_size,coffees_per_packet,0,par from src)
    insert into _ing_map select id,new_id from src;

    -- drinks
    with src as (select *, gen_random_uuid() new_id from public.products where branch_id=p_copy_from),
    ins as (
      insert into public.products(id,branch_id,name,price)
      select new_id,v_id,name,price from src)
    insert into _prod_map select id,new_id from src;

    -- recipes, remapped onto the new drinks and supplies
    insert into public.recipe_items(product_id,ingredient_id,qty,branch_id)
    select pm.new_id, im.new_id, ri.qty, v_id
    from public.recipe_items ri
    join _prod_map pm on pm.old_id = ri.product_id
    join _ing_map  im on im.old_id = ri.ingredient_id
    where ri.branch_id = p_copy_from;

    -- extras
    with src as (select *, gen_random_uuid() new_id from public.extras where branch_id=p_copy_from),
    ins as (
      insert into public.extras(id,branch_id,name,price,ingredient_id,qty,active)
      select s.new_id,v_id,s.name,s.price,im.new_id,s.qty,s.active
      from src s join _ing_map im on im.old_id = s.ingredient_id)
    insert into _extra_map select id,new_id from src;

    -- which drinks each extra is offered on
    insert into public.extra_products(extra_id,product_id,branch_id)
    select em.new_id, pm.new_id, v_id
    from public.extra_products ep
    join _extra_map em on em.old_id = ep.extra_id
    join _prod_map  pm on pm.old_id = ep.product_id
    where ep.branch_id = p_copy_from;
  end if;

  select name into v_myname from public.profiles where id=v_me;
  insert into public.admin_audit(action,branch_id,branch_name,details,done_by,done_by_name)
  values('create_branch', v_id, v_name,
         jsonb_build_object('copied_from', p_copy_from), v_me, coalesce(v_myname,'-'));

  return v_id;
end $function$;

-- ---------------------------------------------------------------- wipe_branch
-- Owner-only. Requires the branch name typed exactly AND the manager override
-- PIN. Every run is written to admin_audit with what was cleared.
--
-- p_opts: {"sales":bool,"stock":bool,"menu":bool,"supplies":bool}
--   sales    - orders, order items, discount log, and the invoice counter
--   stock    - zero all stock levels + delete the issues log
--   menu     - drinks and their recipes
--   supplies - supplies and extras (requires menu too: recipes point at supplies)
create or replace function public.wipe_branch(
    p_branch uuid, p_opts jsonb, p_confirm_name text, p_pin text)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $function$
declare
  v_me uuid; v_myname text; v_name text; v_hash text;
  o_sales boolean; o_stock boolean; o_menu boolean; o_supplies boolean;
  n_orders int:=0; n_issues int:=0; n_prod int:=0; n_ing int:=0; n_extra int:=0;
begin
  v_me := auth.uid();
  if v_me is null then raise exception 'Not authenticated'; end if;
  if not public.is_admin() then raise exception 'Only an owner can clear a branch'; end if;

  select name into v_name from public.branches where id = p_branch;
  if v_name is null then raise exception 'Branch not found'; end if;

  if btrim(coalesce(p_confirm_name,'')) <> v_name then
    raise exception 'Type the branch name exactly ("%") to confirm', v_name; end if;

  select override_pin_hash into v_hash from public.shop_secrets where id = 1;
  if v_hash is null then
    raise exception 'Set a manager override PIN first (Admin, Settings) - it is required to clear a branch'; end if;
  if nullif(btrim(coalesce(p_pin,'')),'') is null
     or extensions.crypt(btrim(p_pin), v_hash) <> v_hash then
    raise exception 'That override PIN is not correct'; end if;

  o_sales    := coalesce((p_opts->>'sales')::boolean,false);
  o_stock    := coalesce((p_opts->>'stock')::boolean,false);
  o_menu     := coalesce((p_opts->>'menu')::boolean,false);
  o_supplies := coalesce((p_opts->>'supplies')::boolean,false);

  if not (o_sales or o_stock or o_menu or o_supplies) then
    raise exception 'Nothing was ticked - choose what to clear'; end if;

  -- recipes reference supplies with ON DELETE RESTRICT, so supplies can only
  -- go if the drinks go with them
  if o_supplies and not o_menu then
    raise exception 'Clearing supplies also clears the recipes that use them - tick "Drinks + recipes" as well';
  end if;

  if o_sales then
    delete from public.discount_log   where branch_id = p_branch;
    with d as (delete from public.orders where branch_id = p_branch returning 1)
      select count(*) into n_orders from d;          -- order_items cascade
    delete from public.invoice_counters where branch_id = p_branch;
  end if;

  if o_stock then
    with d as (delete from public.issues where branch_id = p_branch returning 1)
      select count(*) into n_issues from d;
    update public.ingredients set stock = 0 where branch_id = p_branch;
  end if;

  if o_menu then
    with d as (delete from public.products where branch_id = p_branch returning 1)
      select count(*) into n_prod from d;            -- recipe_items cascade
  end if;

  if o_supplies then
    with d as (delete from public.extras where branch_id = p_branch returning 1)
      select count(*) into n_extra from d;           -- extra_products cascade
    with d as (delete from public.ingredients where branch_id = p_branch returning 1)
      select count(*) into n_ing from d;
  end if;

  select name into v_myname from public.profiles where id = v_me;
  insert into public.admin_audit(action,branch_id,branch_name,details,done_by,done_by_name)
  values('wipe_branch', p_branch, v_name,
         jsonb_build_object('options',p_opts,'orders',n_orders,'issues',n_issues,
                            'products',n_prod,'supplies',n_ing,'extras',n_extra),
         v_me, coalesce(v_myname,'-'));

  return jsonb_build_object('orders',n_orders,'issues',n_issues,
                            'products',n_prod,'supplies',n_ing,'extras',n_extra);
end $function$;

grant execute on function public.create_branch(text,text,uuid,text)      to authenticated;
grant execute on function public.wipe_branch(uuid,jsonb,text,text)       to authenticated;

commit;
