// ============================================================================
// admin-users — Supabase Edge Function
// Lets ADMINS create team members, reset passwords, and remove members.
// These need the Supabase service_role key, which must never touch the browser,
// so they run here on the server. The service_role + project URL are injected
// automatically by Supabase as environment variables — no secrets to set.
//
// Deploy:  supabase functions deploy admin-users --project-ref <your-ref>
// ============================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Who is calling? (verify their JWT with an anon client scoped to their token)
    const authHeader = req.headers.get("Authorization") ?? "";
    const asUser = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await asUser.auth.getUser();
    if (!user) return json({ error: "Not authenticated" }, 401);

    // Elevated client for admin operations.
    const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });

    // Caller must be an admin.
    const { data: prof } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (!prof || prof.role !== "admin") return json({ error: "Admins only" }, 403);

    const body = await req.json();
    const action = body?.action;

    if (action === "create") {
      const { email, password, name, role } = body;
      if (!email || !password) return json({ error: "email and password required" }, 400);
      const { data: created, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role },
      });
      if (error) return json({ error: error.message }, 400);
      await admin.from("profiles").upsert({ id: created.user!.id, name, email, role });
      return json({ ok: true, id: created.user!.id });
    }

    if (action === "setPassword") {
      const { userId, password } = body;
      if (!userId || !password) return json({ error: "userId and password required" }, 400);
      const { error } = await admin.auth.admin.updateUserById(userId, { password });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "delete") {
      const { userId } = body;
      if (!userId) return json({ error: "userId required" }, 400);
      if (userId === user.id) return json({ error: "You can't remove yourself" }, 400);
      const { error } = await admin.auth.admin.deleteUser(userId);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
