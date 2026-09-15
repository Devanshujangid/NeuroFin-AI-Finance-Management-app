"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-server";

import { request } from "@arcjet/next";
import { aj } from "@/lib/arcjet";

export async function setDefaultAccount(accountId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // ------------------------------------------
// 2. ARCJET PROTECTION
// ------------------------------------------
const req = await request();

const decision = await aj.protect(req, {
  userId,
  requested: 1,
});

if (decision.isDenied()) {
  throw new Error("Too many requests. Please try again later.");
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