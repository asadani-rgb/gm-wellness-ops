-- ============================================================================
-- GM Wellness Ops - Phase 6 : amend an issued bill, and park/recall orders
--
-- Run ONCE in Supabase -> SQL Editor, after phase5.sql. Idempotent.
--
--  1. AMENDING. A numbered tax invoice cannot lawfully be edited in place, so
--     "amend" means cancel the old one and issue a corrected replacement. The
--     two are linked in BOTH directions (orders.replaces / orders.replaced_by)
--     so a cancelled invoice always explains itself in Reports.
--
--  2. The extras snapshot on order_items now records each extra's id, so an
--     order can be rebuilt into an editable cart. Older rows only carry the
--     name; the app falls back to matching by name for those.
--
--  3. PARKED ORDERS. A parked order is just a saved cart - it never touches
--     stock, never takes an invoice number, and is shared across the tills at
--     that branch so one till can park and another can recall.
-- ============================================================================

begin;

-- ------------------------------------------------------- amend link (2-way)
alter table public.orders
  add column if not exists replaces    uuid references public.orders(id) on delete set null,
  add column if not exists replaced_by uuid references public.orders(id) on delete set null;

create index if not exists orders_replaces_idx on public.orders(replaces);

-- ---------------------------------------------------------- parked orders
create table if not exists public.parked_orders (
  id          uuid primary key default gen_random_uuid(),
  branch_id   uuid not null references public.branches(id) on delete cascade,
  label       text not null,
  payload     jsonb not null default '{}'::jsonb,
  item_count  integer not null default 0,
  total_est   numeric not null default 0,
  created_by  uuid,
  created_by_name text,
  created_at  timestamptz not null default now()
);
create index if not exists parked_branch_idx on public.parked_orders(branch_id, created_at desc);

alter table public.parked_orders enable row level security;

-- Parked orders hold no money and no invoice number, so staff may create and
-- clear their own branch's ones directly.
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname='public' and tablename='parked_orders'
  loop execute format('drop policy %I on public.parked_orders', p.policyname); end loop;
end $$;

create policy "read parked_orders" on public.parked_orders for select to authenticated
  using (public.is_admin() or branch_id = public.my_branch_id());
create policy "insert parked_orders" on public.parked_orders for insert to authenticated
  with check (public.can_access_branch(branch_id));
create policy "delete parked_orders" on public.parked_orders for delete to authenticated
  using (public.can_access_branch(branch_id));

-- ---------------------------------------------------------------- record_order
-- Same as phase5, plus:
--   * the extras snapshot carries each extra's id
--   * p_payload->>'replaces' links a re-issued bill to the cancelled original
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
  v_replaces uuid; v_rep_status text; v_rep_branch uuid;
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

  -- the invoice being replaced must be cancelled, and in this same branch
  v_replaces := nullif(p_payload->>'replaces','')::uuid;
  if v_replaces is not null then
    select status, branch_id into v_rep_status, v_rep_branch from public.orders where id = v_replaces;
    if v_rep_status is null then raise exception 'The invoice being amended was not found'; end if;
    if v_rep_branch <> v_branch then raise exception 'The invoice being amended belongs to another branch'; end if;
    if v_rep_status <> 'cancelled' then
      raise exception 'Cancel the original invoice before re-issuing it'; end if;
    if exists (select 1 from public.orders where replaces = v_replaces) then
      raise exception 'That invoice has already been replaced'; end if;
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

  if exists (
    select 1 from jsonb_array_elements(p_payload->'items') as t(it)
    join public.products p on p.id = (t.it->>'product_id')::uuid
    where p.branch_id <> v_branch
  ) then raise exception 'That order mixes drinks from another branch'; end if;

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

  -- 3) invoice number: own series per branch, per Indian FY (Apr-Mar)
  v_year := extract(year from now())::int; v_month := extract(month from now())::int;
  if v_month < 4 then v_fy := (v_year-1)::text || '-' || right(v_year::text,2);
  else v_fy := v_year::text || '-' || right((v_year+1)::text,2); end if;
  insert into public.invoice_counters(branch_id,fy,last_no) values(v_branch,v_fy,1)
    on conflict (branch_id,fy) do update set last_no = public.invoice_counters.last_no + 1
    returning last_no into v_seq;
  v_inv := v_prefix || '/' || v_fy || '/' || lpad(v_seq::text,4,'0');

  -- 4) create order shell
  insert into public.orders(invoice_no,payment_mode,order_type,sold_by,branch_id,replaces)
    values(v_inv, p_payload->>'payment_mode', p_payload->>'order_type', v_me, v_branch, v_replaces)
    returning id into v_order;

  if v_replaces is not null then
    update public.orders set replaced_by = v_order where id = v_replaces;
  end if;

  -- 5) items (+ snapshot extras WITH their ids, and the recipe actually used)
  for it in select * from jsonb_array_elements(p_payload->'items') loop
    v_pid := (it->>'product_id')::uuid; v_qty := coalesce((it->>'qty')::int,1);
    select price, name into v_pp, v_pname from public.products where id=v_pid;
    if v_pp is null then raise exception 'Product not found'; end if;

    select coalesce(jsonb_agg(jsonb_build_object(
             'id',e.id,'name',e.name,'price',e.price,'ingredient_id',e.ingredient_id,'qty',e.qty)),'[]'::jsonb),
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

commit;
