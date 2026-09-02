-- ============================================================================
-- GM Wellness Ops - Phase 2 : cart POS, extras, orders and GST tax invoices
--
-- NOTE: this file was RECONSTRUCTED on 2026-09-02 from the live database
-- (project maveiesrskwfplzjsyjr) after the original was lost before it was
-- ever committed. The table definitions and function bodies below were dumped
-- from the running database, so they match production exactly. Run phase3.sql
-- after this one.
--
-- Safe to re-run: everything is IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================================

begin;

-- ---------------------------------------------------------------- extras
create table if not exists public.extras (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  price         numeric not null default 0,
  ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  qty           numeric not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- which drinks each extra is offered on
create table if not exists public.extra_products (
  extra_id   uuid not null references public.extras(id)   on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  primary key (extra_id, product_id)
);

-- ---------------------------------------------------------------- orders
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  invoice_no   text unique,
  gross        numeric not null default 0,
  taxable      numeric not null default 0,
  cgst         numeric not null default 0,
  sgst         numeric not null default 0,
  tax          numeric not null default 0,
  round_off    numeric not null default 0,
  total        numeric not null default 0,
  payment_mode text,
  order_type   text,
  sold_by      uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders(created_at desc);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  product_name text not null,
  qty          integer not null default 1,
  unit_price   numeric not null default 0,
  extras       jsonb   not null default '[]'::jsonb,
  line_total   numeric not null default 0
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- one running invoice number per Indian financial year (Apr-Mar)
create table if not exists public.invoice_counters (
  fy      text primary key,
  last_no integer not null default 0
);

-- ------------------------------------------------------- GST shop settings
alter table public.shop_settings
  add column if not exists legal_name     text,
  add column if not exists gstin          text,
  add column if not exists address        text,
  add column if not exists state          text,
  add column if not exists phone          text,
  add column if not exists fssai          text,
  add column if not exists invoice_prefix text    not null default 'GMW',
  add column if not exists gst_rate       numeric not null default 5,
  add column if not exists order_type_on  boolean not null default true;

-- ---------------------------------------------------------------- RLS
-- Same convention as schema.sql: everyone signed in can read; only admins
-- write directly. (phase3.sql later narrows orders/order_items to read-only
-- so invoices can only be written by the RPCs.)
do $$
declare t text;
begin
  foreach t in array array['extras','extra_products','orders','order_items','invoice_counters'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "read %1$s" on public.%1$s', t);
    execute format('create policy "read %1$s" on public.%1$s for select to authenticated using (true)', t);
  end loop;

  foreach t in array array['extras','extra_products'] loop
    execute format('drop policy if exists "write %1$s" on public.%1$s', t);
    execute format('create policy "write %1$s" on public.%1$s for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- ---------------------------------------------------------------- record_order
-- Superseded by phase3.sql (which adds discounts). Kept here so this file
-- alone reproduces the phase-2 state of the database.
create or replace function public.record_order(p_payload jsonb)
 returns uuid
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_short text; v_rate numeric; v_prefix text;
  v_year int; v_month int; v_fy text; v_seq int; v_inv text;
  v_order uuid; v_gross numeric := 0;
  v_total numeric; v_taxable numeric; v_tax numeric; v_cgst numeric; v_sgst numeric;
  it jsonb; v_pid uuid; v_qty int; v_pp numeric; v_pname text;
  v_extras jsonb; v_extra_sum numeric; v_line numeric;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if jsonb_array_length(coalesce(p_payload->'items','[]'::jsonb)) = 0 then
    raise exception 'Cart is empty'; end if;

  select gst_rate, invoice_prefix into v_rate, v_prefix from public.shop_settings where id=1;
  v_rate := coalesce(v_rate,5); v_prefix := coalesce(v_prefix,'GMW');

  -- 1) check stock (product recipes + extras)
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

  -- 3) invoice number (Indian FY Apr-Mar)
  v_year := extract(year from now())::int; v_month := extract(month from now())::int;
  if v_month < 4 then v_fy := (v_year-1)::text || '-' || right(v_year::text,2);
  else v_fy := v_year::text || '-' || right((v_year+1)::text,2); end if;
  insert into public.invoice_counters(fy,last_no) values(v_fy,1)
    on conflict (fy) do update set last_no = public.invoice_counters.last_no + 1
    returning last_no into v_seq;
  v_inv := v_prefix || '/' || v_fy || '/' || lpad(v_seq::text,4,'0');

  -- 4) create order
  insert into public.orders(invoice_no,payment_mode,order_type,sold_by)
    values(v_inv, p_payload->>'payment_mode', p_payload->>'order_type', auth.uid())
    returning id into v_order;

  -- 5) items (+ snapshot extras)
  for it in select * from jsonb_array_elements(p_payload->'items') loop
    v_pid := (it->>'product_id')::uuid; v_qty := coalesce((it->>'qty')::int,1);
    select price, name into v_pp, v_pname from public.products where id=v_pid;
    if v_pp is null then raise exception 'Product not found'; end if;
    select coalesce(jsonb_agg(jsonb_build_object('name',e.name,'price',e.price,'ingredient_id',e.ingredient_id,'qty',e.qty)),'[]'::jsonb),
           coalesce(sum(e.price),0)
      into v_extras, v_extra_sum
      from jsonb_array_elements_text(coalesce(it->'extras','[]'::jsonb)) ex(eid)
      join public.extras e on e.id = ex.eid::uuid;
    v_line := (v_pp + v_extra_sum) * v_qty;
    v_gross := v_gross + v_line;
    insert into public.order_items(order_id,product_id,product_name,qty,unit_price,extras,line_total)
      values(v_order, v_pid, v_pname, v_qty, v_pp, v_extras, v_line);
  end loop;

  -- 6) GST (prices are inclusive) + round to nearest rupee
  v_total := round(v_gross);
  v_taxable := round(v_total / (1 + v_rate/100.0), 2);
  v_tax := round(v_total - v_taxable, 2);
  v_cgst := round(v_tax/2.0, 2); v_sgst := v_tax - v_cgst;
  update public.orders set gross=v_gross, total=v_total, taxable=v_taxable,
    tax=v_tax, cgst=v_cgst, sgst=v_sgst, round_off=round(v_total - v_gross,2)
    where id=v_order;

  return v_order;
end $function$;

-- ---------------------------------------------------------------- reverse_order
-- Phase 2 behaviour: DELETED the invoice. phase3.sql replaces this with a
-- soft cancel, because deleting a numbered tax invoice breaks the GST
-- sequence and destroys the audit trail. Kept here for completeness only.
create or replace function public.reverse_order(p_order_id uuid)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_ts timestamptz; oi record; ex jsonb;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select created_at into v_ts from public.orders where id=p_order_id;
  if v_ts is null then raise exception 'Order not found'; end if;
  if not (public.is_admin() or v_ts > now() - interval '24 hours') then
    raise exception 'Orders can only be reversed within 24 hours'; end if;

  for oi in select * from public.order_items where order_id=p_order_id loop
    update public.ingredients i set stock = i.stock + ri.qty * oi.qty
      from public.recipe_items ri where ri.product_id = oi.product_id and ri.ingredient_id = i.id;
    for ex in select * from jsonb_array_elements(coalesce(oi.extras,'[]'::jsonb)) loop
      if (ex->>'ingredient_id') is not null then
        update public.ingredients i set stock = i.stock + coalesce((ex->>'qty')::numeric,0) * oi.qty
          where i.id = (ex->>'ingredient_id')::uuid;
      end if;
    end loop;
  end loop;

  delete from public.orders where id=p_order_id;
end $function$;

grant execute on function public.record_order(jsonb)  to authenticated;
grant execute on function public.reverse_order(uuid)  to authenticated;

commit;
