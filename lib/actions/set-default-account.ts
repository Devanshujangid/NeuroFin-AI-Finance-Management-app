"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function setDefaultAccount(accountId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Step 1 → reset all accounts to false
  const { error: resetError } = await supabaseAdmin
    .from("accounts")
    .update({ is_default: false })
    .eq("user_id", userId);

  if (resetError) {
    throw new Error("Failed to reset default accounts");
  }

  // Step 2 → set selected account as default
  const { error: updateError } = await supabaseAdmin
    .from("accounts")
    .update({ is_default: true })
    .eq("id", accountId)
    .eq("user_id", userId);

  if (updateError) {
    throw new Error("Failed to set default account");
  }

  return { success: true };
}