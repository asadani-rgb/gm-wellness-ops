-- ============================================================================
-- GM Wellness Ops - Phase 4 : manager override PIN for large discounts
--
-- Run ONCE in Supabase -> SQL Editor, after phase3.sql. Idempotent.
--
-- Staff may now go above shop_settings.max_staff_discount_pct, but only by
-- entering a manager override PIN. The PIN is stored as a bcrypt hash in a
-- table with NO RLS policies at all, so it is unreadable through the API -
-- only the SECURITY DEFINER functions below can touch it.
--
-- Orders that went over the limit are flagged (orders.over_limit) so they can
-- be reviewed in Admin -> Reports.
-- ============================================================================

begin;

create extension if not exists pgcrypto with schema extensions;

-- ------------------------------------------------------------- the PIN store
create table if not exists public.shop_secrets (
  id               integer primary key default 1,
  override_pin_hash text,
  updated_at       timestamptz,
  updated_by       uuid,
  constraint shop_secrets_single_row check (id = 1)
);
insert into public.shop_secrets(id) values (1) on conflict (id) do nothing;

alter table public.shop_secrets enable row level security;
-- Deliberately no policies: unreachable over the REST API by anyone.
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname='public' and tablename='shop_secrets'
  loop execute format('drop policy %I on public.shop_secrets', p.policyname); end loop;
end $$;
revoke all on public.shop_secrets from anon, authenticated;

-- ---------------------------------------------------------- flag on orders
alter table public.orders
  add column if not exists over_limit  boolean not null default false,
  add column if not exists override_by uuid;

-- ------------------------------------------------------------ set / check PIN
create or replace function public.set_override_pin(p_pin text)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_pin text;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if not public.is_admin() then raise exception 'Only an owner can set the override PIN'; end if;
  v_pin := btrim(coalesce(p_pin,''));
  if v_pin = '' then
    update public.shop_secrets set override_pin_hash=null, updated_at=now(), updated_by=auth.uid() where id=1;
    return;
  end if;
  if v_pin !~ '^[0-9]{4,8}$' then raise exception 'The override PIN must be 4 to 8 digits'; end if;
  update public.shop_secrets
     set override_pin_hash = extensions.crypt(v_pin, extensions.gen_salt('bf')),
         updated_at = now(), updated_by = auth.uid()
   where id = 1;
end $function$;

-- Lets the UI say whether a PIN exists, without exposing it.
create or replace function public.has_override_pin()
 returns boolean
 language sql
 security definer
 set search_path to 'public'
as $function$
  select override_pin_hash is not null from public.shop_secrets where id = 1;
$function$;

grant execute on function public.set_override_pin(text) to authenticated;
grant execute on function public.has_override_pin()    to authenticated;

-- ---------------------------------------------------------------- record_order
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
  v_pin text; v_hash text; v_over boolean := false; v_override_by uuid;
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
  v_pin      := nullif(btrim(coalesce(p_payload->>'override_pin','')),'');

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

    if v_eff_pct > v_cap then
      v_over := true;
      -- Owners are trusted; anyone else needs the manager override PIN.
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
    customer_name = v_cust,
    over_limit = v_over, override_by = v_override_by
  where id = v_order;

  -- 8) append-only audit entry
  if v_disc > 0 then
    insert into public.discount_log(order_id,invoice_no,gross,discount_amount,discount_pct,
                                    reason,customer_name,given_by,given_by_name,given_by_role)
    values (v_order, v_inv, v_gross, v_disc, v_disc_pct,
            case when v_over then '[OVER LIMIT] ' || v_reason else v_reason end,
            v_cust, v_me, coalesce(v_myname,'-'), coalesce(v_myrole,'-'));
  end if;

  return v_order;
end $function$;

commit;
