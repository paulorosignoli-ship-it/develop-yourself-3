import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseEnabled = Boolean(url && serviceRoleKey);

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the service role key.
 * Never import this from a "use client" component — it must only run
 * inside Route Handlers / Server Components, and the key must never
 * reach the browser.
 *
 * Returns null when SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not
 * configured, so callers can treat persistence as optional.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseEnabled) return null;
  if (!client) {
    client = createClient(url as string, serviceRoleKey as string, {
      auth: { persistSession: false },
    });
  }
  return client;
}
