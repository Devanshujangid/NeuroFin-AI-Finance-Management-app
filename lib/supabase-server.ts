import { createClient } from "@supabase/supabase-js";
// this file creates DB connection object-- DB ACCESS LAYER
// this is my authentication pipe to talk to postgre sql
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
