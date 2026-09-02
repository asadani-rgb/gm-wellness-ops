-- ============================================================================
-- GM Wellness Ops - Phase 3
-- Auditable discounts · soft-cancelled invoices · customer name on the bill
--
-- Run ONCE in Supabase -> SQL Editor. It is idempotent (safe to re-run).
--
-- What changes and why
--  1. Discounts are recorded on the order AND in an append-only discount_log
--     that only the database functions can write to. Management can always
--     see who gave what, to whom, and why.
--  2. Staff are capped by shop_settings.max_staff_discount_pct (default 15%).
--     The cap is enforced HERE, in the database - not in the browser - so it
--     cannot be bypassed by editing JavaScript.
--  3. GST is charged on the DISCOUNTED value. This is correct under
--     s.15(3)(a) CGST Act: a discount given at the time of supply and shown
--     on the face of the invoice is excluded from the value of supply.
--  4. Reversing an order no longer DELETES it. A numbered Tax Invoice must
--     not vanish - that leaves a gap in the sequence and destroys the audit
--     trail. Orders are now marked 'cancelled' with a reason, and stock is
--     still restored.
--  5. Each order item now stores a snapshot of the recipe used, so cancelling
--     an old order restores the ingredients that were ACTUALLY consumed even
--     if the recipe has been edited since.
-- ============================================================================

begin;

-- ---------------------------------------------------------------- 1. settings
alter table public.shop_settings
  add column if not exists max_staff_discount_pct numeric not null default 15;

-- ---------------------------------------------------------------- 2. orders
alter table public.orders
  add column if not exists discount_amount  numeric not null default 0,
  add column if not exists discount_pct     numeric,
  add column if not exists discount_reason  text,
  add column if not exists discount_by      uuid,
  add column if not exists discount_by_name text,
  add column if not exists customer_name    text,
  add column if not exists status           text not null default 'active',
  add column if not exists cancelled_at     timestamptz,
  add column if not exists cancelled_by     uuid,
  add column if not exists cancelled_by_name text,
  add column if not exists cancel_reason    text;

alter table public.orders drop constraint if exists orders_status_chk;
alter table public.orders add constraint orders_status_chk
  check (status in ('active','cancelled'));

create index if not exists orders_status_created_idx
  on public.orders(status, created_at desc);

alter table public.order_items
  add column if not exists recipe_snapshot jsonb not null default '[]'::jsonb;

-- Nothing may edit or delete an order directly: every change must go through
-- the SECURITY DEFINER functions below. schema.sql grants a blanket
-- "write <table>" FOR ALL policy to admins, which would let an owner's browser
-- edit or delete an invoice straight through the REST API and leave no trace.
-- Replace it with read-only access so the audit trail actually holds.
do $$
declare p record; t text;
begin
  foreach t in array array['orders','order_items'] loop
    for p in select policyname, cmd from pg_policies
             where schemaname='public' and tablename=t and cmd in ('UPDATE','DELETE','INSERT','ALL')
    loop
      execute format('drop policy %I on public.%I', p.policyname, t);
      raise notice 'dropped % policy "%" on %', p.cmd, p.policyname, t;
    end loop;

    execute format('alter table public.%I enable row level security', t);

    -- keep reads working for every signed-in user
    execute format('drop policy if exists "read %1$s" on public.%1$s', t);
    execute format('create policy "read %1$s" on public.%1$s for select to authenticated using (true)', t);
  end loop;
  raise notice 'orders and order_items are now read-only over the API; all writes go through the RPCs.';
end $$;

-- ------------------------------------------------- 3. append-only discount log
create table if not exists public.discount_log (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid references public.orders(id) on delete set null,
  invoice_no     text,
  gross          numeric not null default 0,
  discount_amount numeric not null default 0,
  discount_pct   numeric,
  reason         text,
  customer_name  text,
  given_by       uuid,
  given_by_name  text,
  given_by_role  text,
  created_at     timestamptz not null default now()
);

alter table public.discount_log enable row level security;

drop policy if exists discount_log_read on public.discount_log;
create policy discount_log_read on public.discount_log
  for select to authenticated using (public.is_admin());
-- Deliberately NO insert / update / delete policy: the table is append-only and
-- writable only by the SECURITY DEFINER function below.

-- ---------------------------------------------------------- 4. record_order
create or replace function public.record_order(p_payload jsonb)
 returns uuid
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_short text; v_rate numeric; v_prefix text; v_cap numeric;
  v_year int; v_month int; v_fy text; v_seq int; v_inv text;
  v_order uuid; v_gross numeric := 0;
  v_total numeric; v_taxable numeric; v_tax numeric; v_cgst numeric; v_sgst numeric;
  it jsonb; v_pid uuid; v_qty int; v_pp numeric; v_pname text;
  v_extras jsonb; v_extra_sum numeric; v_line numeric; v_recipe jsonb;
  v_disc numeric := 0; v_disc_pct numeric; v_reason text; v_cust text;
  v_is_admin boolean; v_me uuid; v_myname text; v_myrole text; v_eff_pct numeric;
begin
  v_me := auth.uid();
  if v_me is null then raise exception 'Not authenticated'; end if;
  if jsonb_array_length(coalesce(p_payload->'items','[]'::jsonb)) = 0 then
    raise exception 'Cart is empty'; end if;

  select gst_rate, invoice_prefix, coalesce(max_staff_discount_pct,15)
    into v_rate, v_prefix, v_cap
    from public.shop_settings where id=1;
  v_rate := coalesce(v_rate,5); v_prefix := coalesce(v_prefix,'GMW'); v_cap := coalesce(v_cap,15);

  v_is_admin := public.is_admin();
  select name, role into v_myname, v_myrole from public.profiles where id = v_me;

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

  -- 4) create order shell
  insert into public.orders(invoice_no,payment_mode,order_type,sold_by)
    values(v_inv, p_payload->>'payment_mode', p_payload->>'order_type', v_me)
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

  -- 6) discount - validated server side, never trusted from the browser
  v_disc_pct := nullif(p_payload->>'discount_pct','')::numeric;
  v_disc     := coalesce(nullif(p_payload->>'discount_amount','')::numeric, 0);
  v_reason   := nullif(btrim(coalesce(p_payload->>'discount_reason','')),'');
  v_cust     := nullif(btrim(coalesce(p_payload->>'customer_name','')),'');

  if v_disc <= 0 and coalesce(v_disc_pct,0) > 0 then
    v_disc := round(v_gross * v_disc_pct / 100.0, 2);
  end if;
  if v_disc < 0 then v_disc := 0; end if;
  if v_disc > v_gross then
    raise exception 'Discount cannot exceed the order value';
  end if;

  if v_disc > 0 then
    v_eff_pct := round(v_disc / nullif(v_gross,0) * 100.0, 2);
    if v_reason is null then
      raise exception 'A reason is required for every discount';
    end if;
    if not v_is_admin and v_eff_pct > v_cap then
      raise exception 'Discount of % percent exceeds the % percent staff limit for this till - ask an owner to approve it', v_eff_pct, v_cap;
    end if;
    if v_disc_pct is null then v_disc_pct := v_eff_pct; end if;
  else
    v_disc_pct := null; v_reason := null;
  end if;

  -- 7) GST on the discounted value (prices are inclusive), rounded to the rupee
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
    customer_name = v_cust
  where id = v_order;

  -- 8) append-only audit entry
  if v_disc > 0 then
    insert into public.discount_log(order_id,invoice_no,gross,discount_amount,discount_pct,
                                    reason,customer_name,given_by,given_by_name,given_by_role)
    values (v_order, v_inv, v_gross, v_disc, v_disc_pct, v_reason, v_cust,
            v_me, coalesce(v_myname,'-'), coalesce(v_myrole,'-'));
  end if;

  return v_order;
end $function$;

-- ---------------------------------------------------------- 5. cancel_order
-- Replaces the old delete-the-row behaviour. The invoice survives, marked
-- cancelled, with who cancelled it and why. Stock is restored from the
-- snapshot taken at the time of sale.
create or replace function public.cancel_order(p_order_id uuid, p_reason text)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_ts timestamptz; v_status text; oi record; ex jsonb; rs jsonb;
  v_me uuid; v_myname text; v_reason text;
begin
  v_me := auth.uid();
  if v_me is null then raise exception 'Not authenticated'; end if;

  v_reason := nullif(btrim(coalesce(p_reason,'')),'');
  if v_reason is null then raise exception 'A reason is required to cancel an invoice'; end if;

  select created_at, status into v_ts, v_status from public.orders where id = p_order_id;
  if v_ts is null then raise exception 'Order not found'; end if;
  if v_status = 'cancelled' then raise exception 'This invoice is already cancelled'; end if;
  if not (public.is_admin() or v_ts > now() - interval '24 hours') then
    raise exception 'Orders can only be cancelled within 24 hours'; end if;

  select name into v_myname from public.profiles where id = v_me;

  for oi in select * from public.order_items where order_id = p_order_id loop
    -- restore the recipe that was actually used, falling back to today's recipe
    -- for orders taken before phase 3 added the snapshot
    if jsonb_array_length(coalesce(oi.recipe_snapshot,'[]'::jsonb)) > 0 then
      for rs in select * from jsonb_array_elements(oi.recipe_snapshot) loop
        update public.ingredients i
          set stock = i.stock + coalesce((rs->>'qty')::numeric,0) * oi.qty
          where i.id = (rs->>'ingredient_id')::uuid;
      end loop;
    else
      update public.ingredients i set stock = i.stock + ri.qty * oi.qty
        from public.recipe_items ri
        where ri.product_id = oi.product_id and ri.ingredient_id = i.id;
    end if;

    -- restore extras
    for ex in select * from jsonb_array_elements(coalesce(oi.extras,'[]'::jsonb)) loop
      if (ex->>'ingredient_id') is not null then
        update public.ingredients i
          set stock = i.stock + coalesce((ex->>'qty')::numeric,0) * oi.qty
          where i.id = (ex->>'ingredient_id')::uuid;
      end if;
    end loop;
  end loop;

  update public.orders set
    status='cancelled', cancelled_at=now(), cancelled_by=v_me,
    cancelled_by_name=coalesce(v_myname,'-'), cancel_reason=v_reason
  where id = p_order_id;
end $function$;

-- Kept so nothing breaks if an old browser tab is still open. It now cancels
-- rather than deletes.
create or replace function public.reverse_order(p_order_id uuid)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  perform public.cancel_order(p_order_id, 'Reversed (no reason recorded)');
end $function$;

grant execute on function public.cancel_order(uuid, text) to authenticated;

commit;
