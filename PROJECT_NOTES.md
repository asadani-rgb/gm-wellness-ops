# GM Wellness Ops — Project Notes

A working POS + inventory web app for the GM Wellness coffee shop. This file is the
quick-context handoff so any new session (or developer) can resume in minutes.

## Live
- **App:** https://gm-wellness-ops.asadani.workers.dev (Cloudflare, auto-deploys on push to `main`)
- **Repo:** github.com/asadani-rgb/gm-wellness-ops (private, branch `main`)
- **Supabase project ref:** `maveiesrskwfplzjsyjr`

## Stack
- **Frontend:** plain HTML/CSS/JS, no framework, no build step — `public/`
- **Backend:** Supabase (Postgres + Auth + Edge Functions), free tier
- **Hosting:** Cloudflare (static, from GitHub) — free
- **Libraries (CDN):** supabase-js, jsPDF (both in `public/index.html`)

## Repo layout
```
public/
  index.html   shell + login; loads supabase-js, jsPDF, config.js, app.js
  app.js       all app logic (~1500 lines, vanilla JS)
  styles.css   Botanical Calm theme (sage green; Fraunces + Instrument Sans); light + dark
  config.js    Supabase URL + anon key (anon key is public/safe to commit)
supabase/
  schema.sql   base tables, RLS, RPCs (record_sale/undo_sale/log_issue), first-user-admin trigger
  phase2.sql   cart/orders/extras/GST migration (extras, orders, order_items, invoice_counters,
               record_order + reverse_order RPCs, RLS) — run once in Supabase SQL editor
               NOTE: reconstructed 2026-09-02 from the live DB; the original was never committed.
  phase3.sql   discounts (+ append-only discount_log), soft-cancelled invoices, customer name,
               recipe snapshot on order_items — run once, after phase2
  phase4.sql   manager override PIN for discounts above the staff limit (shop_secrets, bcrypt
               hash, set_override_pin/has_override_pin, orders.over_limit) — run once, after phase3
  seed.sql     sample coffees + supplies (optional)
  functions/admin-users/index.ts   Edge Function: admin add-user / reset-password / remove
README.md      full first-time setup + deploy guide
```

## Design decisions
- **Botanical Calm** look; default **light** theme, toggle on login.
- Currency **shop-controlled** (Admin → Settings), default **INR**. Prices are **GST-inclusive**.
- **Regular GST** registration → **Tax Invoice**: CGST 2.5% + SGST 2.5% shown separately, SAC 9963,
  sequential invoice number `GMW/<FY>/0001` (resets each Indian FY Apr–Mar), place of supply = shop state.
  GST rate default 5% (standalone cafe). India disclaimers printed on the bill.
- Two roles: **admin** (full) and **staff** (Sell, Stock, Issues, Orders).

## Features (built)
- **Sell:** cart-only — Add to order → customize (qty + per-drink extras) → **Review** (dine-in/takeaway,
  payment mode, live GST) → **Submit** → Tax Invoice (print + PDF).
- **Extras:** Admin-configured; each **always linked to a supply** (draws down stock); free or chargeable;
  offered **per drink**. Auto-default amounts + inline units + soft out-of-range warnings.
- **Stock:** live levels with status (Healthy/Low/Critical) vs Target level; “+ Packet” restock; delete.
- **Issues:** log spillage/waste in “coffees” or units; corrects stock.
- **Orders:** searchable history; reprint any bill; **cancel** (24h staff / anytime admin) restores
  stock and marks the invoice CANCELLED with a reason. The row and its number are never deleted.
- **Discounts:** presets 5/10/15% + custom (% or amount), applied at Review. A **reason is mandatory**.
  Staff are capped by `shop_settings.max_staff_discount_pct` (default 15%), **enforced in the RPC**,
  not the browser. Above the cap a staff member sees a **red alert** (management may recover an
  unjustified discount from salary) and must enter the **manager override PIN**; admins are warned
  but never asked for it. Over-cap orders are flagged `orders.over_limit` and called out in Reports. Every discount is written to the append-only `discount_log`
  with who/how much/why, plus onto the order for the bill. GST is charged on the **discounted** value
  (s.15(3)(a) CGST Act - discount shown on the face of the invoice).
- **Reports (admin):** date range (today / yesterday / 7d / month / last month / FY / custom) →
  GST summary for GSTR-1/3B, split by payment mode, day-by-day table, **discount audit trail**,
  **cancelled invoices** list, CSV export for the accountant. Queries its own range (Orders only
  caches 14 days). Cancelled invoices are excluded from every total but still listed and exported.
- **Bill formats:** A4/slip, 80 mm and 58 mm thermal. Choice is per-till, remembered in that
  browser's localStorage, and drives both the print `@page` size and the jsPDF page width.
- **Analytics:** revenue, #orders, cups, top seller, daily volume, stock situation (cancelled excluded).
- **Admin:** Supplies, Coffees (recipes), Extras, Team (add/reset/remove via Edge Function), Settings
  (shop + GST/invoice + backup export/import).

## Per-serving standards (defaults + warning ranges)
beans 18 g/shot (7–25) · milk splash 40 ml / full 150 ml (20–200) · powders 10 g (5–20) ·
syrups 10 ml (5–30) · pcs 1 (1–3). Warnings are soft (never block).

## How we work (edit → deploy loop)
1. Files are edited and land in the local folder `C:\gm-wellness-ops` (connect it in the desktop app via **Add folder** if a new session).
2. Deploy from that folder:
   ```
   git commit -am "message"
   git push
   ```
   Cloudflare rebuilds in ~1 min; hard-refresh (Ctrl+Shift+R). CDN edge cache can lag ~1 min.
3. Database changes = run the relevant SQL in Supabase → SQL Editor.
4. If `git` complains about `.git/index.lock`, run `del .git\index.lock` then retry.

## Setup gotchas (learned)
- New Supabase users need **Auto Confirm** (mailer_autoconfirm is off) or login fails “Email not confirmed”.
- `admin-users` Edge Function should be deployed with **Verify JWT OFF** (function does its own admin check;
  keeps the browser preflight working).
- Set Supabase **Auth → URL Configuration → Site URL** to the live URL (default was localhost).
- The `config.js` anon key is meant to be public; RLS protects the data. Never commit the service_role key.

## Audit / compliance decisions (2026-09-02)
- A numbered Tax Invoice is **never deleted**. `reverse_order` used to `DELETE FROM orders`, which
  left gaps in the GMW/FY/NNNN sequence and silently removed revenue from reports. It is now a soft
  cancel (`cancel_order(order_id, reason)`); the old name still works and forwards to it.
- `orders` and `order_items` are **read-only over the REST API** after phase3. schema.sql's blanket
  `write <table>` FOR ALL policy would have let an admin's browser edit or delete an invoice directly
  with no trace; phase3 drops it and leaves only a read policy. All writes go through the
  SECURITY DEFINER RPCs.
- `discount_log` has a SELECT policy (admins) and **no insert/update/delete policy at all**, so it is
  append-only by construction - only the RPC can write to it.
- `order_items.recipe_snapshot` records the recipe used at the time of sale, so cancelling an old
  order restores what was actually consumed even if the recipe has since been edited.
- The override PIN lives in `shop_secrets` as a **bcrypt hash**, in a table with RLS on and **no
  policies at all** plus `revoke all` - unreachable over the API. Only `set_override_pin` (admin
  only) and `record_order` touch it. There is no rate limit on PIN attempts; a signed-in staff
  member could brute-force a 4-digit PIN through the API, so prefer 6+ digits and rotate it if
  someone leaves.

## Known trap: never re-render a view while someone is typing in it
`render()` rebuilds `#view` wholesale. Doing that on every `oninput` destroyed the number input
mid-keystroke - you literally could not type `100` into the discount box. The discount panel now
renders once and `refreshDisc()` patches only the pieces that change (pill, warning, totals,
submit state, hidden toggles). Structural changes (preset buttons) still call `render()`; text
fields must not. Same reason `.empty svg` needed an explicit size: unsized inline SVGs expand to
fill their container.

## Ideas / next
- Deploy/confirm `admin-users` (in-app Add member / Reset password). Supabase → Edge Functions →
  deploy `admin-users` with **Verify JWT OFF** (it does its own admin check). Team actions now report
  the real reason when it is missing, instead of a generic "could not".
- Credit notes for cancellations (currently a cancelled invoice is excluded rather than credited).
- `record_order` checks stock then decrements in two separate statements - two tills submitting at the
  same instant could oversell. Add row locking if you ever run more than one till.
- Daily Z-report / cash-drawer close; per-staff sales; low-stock email.
