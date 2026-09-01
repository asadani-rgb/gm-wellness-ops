// ─────────────────────────────────────────────────────────────
// GM Wellness — Supabase connection
//
// Fill these two values from your Supabase project:
//   Supabase Dashboard → Project Settings → API
//     • Project URL       → SUPABASE_URL
//     • Project API keys → "anon" "public" key → SUPABASE_ANON_KEY
//
// The anon key is SAFE to commit and ship in the browser — it is a public
// client key, and your data is protected by Row Level Security (see
// supabase/schema.sql). NEVER put the "service_role" key in this file.
// ─────────────────────────────────────────────────────────────
window.GM_CONFIG = {
  SUPABASE_URL: "https://YOUR-PROJECT-REF.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-ANON-PUBLIC-KEY"
};
