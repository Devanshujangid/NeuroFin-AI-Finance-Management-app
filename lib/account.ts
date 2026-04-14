// file contain all accounts DB logic]

import { supabaseAdmin } from "./supabase-server";
export async function getAccounts(userId: string) {
    const supabase = supabaseAdmin;

    const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data;

}