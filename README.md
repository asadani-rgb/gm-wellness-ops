# GM Wellness Ops

A small web app for a coffee shop: sell coffee at the counter, watch stock draw
down live, log waste/loss, see sales & stock analytics, and manage the team —
with admin/staff logins.

- **Frontend:** plain HTML/CSS/JS (no build step) in [`public/`](public/)
- **Backend:** [Supabase](https://supabase.com) — Postgres database, email/password auth, and one Edge Function for user management
- **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com) (free) serving the static site

Total running cost for a single shop: **$0/month** on the free tiers. The only
optional cost is a custom domain (~₹700–1000 / year).

---

## How it fits together

```
Browser (Cloudflare Pages, static files in /public)
   │  supabase-js
   ▼
Supabase project
   ├── Auth            → email + password logins
   ├── Postgres        → ingredients, products, recipe_items, sales, issues, profiles, shop_settings
   ├── RLS + RPCs      → staff can sell/log; only admins edit the catalog; stock changes run server-side
   └── Edge Function   → admin-users (create user / reset password / remove user)
```

Roles live in the `profiles` table. **Admin** sees everything (catalog, team,
settings, analytics). **Staff** can only Sell, view Stock, and log Issues.

---

## Setup — one time (~20 minutes)

### 1. Create a Supabase project
1. Sign up at [supabase.com](https://supabase.com) → **New project** (free plan).
2. Pick a name and a strong database password; choose the region closest to the shop.
3. Wait for it to finish provisioning.

### 2. Create the database
1. In Supabase go to **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
3. (Optional) Paste [`supabase/seed.sql`](supabase/seed.sql) and **Run** it to pre-fill sample coffees and supplies. Skip this to start empty.

### 3. Create your first admin login
1. Go to **Authentication → Users → Add user**.
2. Enter your email + a password and enable **Auto Confirm User**.
3. The database automatically makes the **first** user an **admin**. (Everyone you add later from inside the app gets the role you choose.)

### 4. Deploy the user-management function
This powers "Add team member / Reset password / Remove" in the app.

**Option A — Supabase CLI (recommended)**
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase functions deploy admin-users
```
`YOUR-PROJECT-REF` is the sub-domain of your project URL (e.g. `abcd1234` in
`https://abcd1234.supabase.co`). The service-role key the function needs is
injected by Supabase automatically — there are no secrets to set.

**Option B — Dashboard:** Edge Functions → Create a function named
`admin-users`, paste [`supabase/functions/admin-users/index.ts`](supabase/functions/admin-users/index.ts), Deploy.

> You can add team members and reset passwords even without this function by
> using **Authentication → Users** in the Supabase dashboard — but deploying it
> lets you do everything from inside the app.

### 5. Connect the app to your project
Open [`public/config.js`](public/config.js) and fill in:
- `SUPABASE_URL` — Project Settings → API → **Project URL**
- `SUPABASE_ANON_KEY` — Project Settings → API → **anon / public** key

The anon key is meant to be public (your data is protected by Row Level
Security), so it's fine to commit. **Never** put the `service_role` key here.

### 6. Try it locally (optional)
Any static server works, e.g.:
```bash
cd public && python3 -m http.server 5173
```
Open http://localhost:5173 and sign in with the admin you created in step 3.

---

## Deploy to Cloudflare Pages (free)

### 7. Put the code on GitHub
```bash
# from the project root
git init
git add .
git commit -m "GM Wellness Ops"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/gm-wellness-ops.git
git push -u origin main
```
(Create the empty `gm-wellness-ops` repo on GitHub first.)

### 8. Create the Cloudflare Pages project
1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick your repo.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `public`
4. **Save and Deploy.** You'll get a URL like `https://gm-wellness-ops.pages.dev`.

That's it — the site is live and free.

### 9. (Optional) Custom domain
In the Pages project → **Custom domains → Set up a domain** and follow the
prompts. If you register the domain through Cloudflare it wires up automatically.

---

## Making updates later

Because it's a plain static site, updating is just editing files and pushing:

```bash
# edit anything in public/ (e.g. add a coffee style, change wording)
git add .
git commit -m "what changed"
git push
```

Cloudflare Pages rebuilds and redeploys automatically on every push, usually
within a minute. Database changes are made by running more SQL in the Supabase
SQL Editor.

Everyday shop changes — coffees, recipes, supplies, prices, currency, team,
passwords — are done **inside the app** (Admin area), no code needed.

---

## Backup & migration (export / import config)

In the app, **Admin → Settings → Backup & migration** lets an admin:

- **Export config** — downloads a JSON file with your coffees, recipes, supplies and shop settings (recipes reference ingredients by name, so the file ports cleanly between projects). Sales history and team members are *not* included.
- **Import config** — pick that file (or paste it) to load the setup into a fresh instance. Importing **replaces** the current coffees, supplies and settings; sales history and team are kept.

This makes standing up a second shop or a new Supabase project a two-minute job: run `schema.sql`, create your admin, then import the file.

## What's where

```
public/
  index.html    the app shell + login screen
  styles.css    all styling (the "Botanical Calm" theme, light + dark)
  app.js        app logic + all Supabase calls
  config.js     your Supabase URL + anon key   ← you fill this in
supabase/
  schema.sql    tables, security rules, and the sell/undo/log-issue functions
  seed.sql      optional sample coffees & supplies
  functions/
    admin-users/index.ts   admin-only: add user / reset password / remove
README.md
```

## Costs

| Piece | Free tier covers | Paid only if |
|---|---|---|
| Supabase | 500 MB database, 50k monthly active users, auth, edge functions | you far outgrow a single shop (Pro is $25/mo) |
| Cloudflare Pages | unlimited requests & bandwidth, HTTPS | never, for this |
| Domain | — | optional, ~₹700–1000/yr |

## Security notes
- The **anon** key in `config.js` is public by design; every table is guarded by Row Level Security.
- The **service_role** key is only ever used inside the `admin-users` Edge Function on Supabase's servers — it is never in this repo or the browser.
- Staff can sell and log issues but cannot edit the catalog or change roles; stock is only ever changed through server-side functions, which also prevent overselling.

## Migrations (run in order, once each, in Supabase → SQL Editor)

1. `supabase/schema.sql`  - base tables, RLS, first-user-becomes-admin trigger
2. `supabase/phase2.sql`  - cart POS, extras, orders, GST tax invoices
3. `supabase/phase3.sql`  - auditable discounts, soft-cancelled invoices, customer name
4. `supabase/phase4.sql`  - manager override PIN for discounts above the staff limit
5. `supabase/phase5.sql`  - multiple branches (**breaking**: deploy the frontend at the same time)

`phase3.sql` is idempotent and prints notices telling you which policies it changed.
After running it, Team → Add member still needs the `admin-users` Edge Function deployed
(Supabase → Edge Functions, **Verify JWT OFF**).
