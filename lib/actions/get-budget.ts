"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function getBudget(accountId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (!accountId) {
      throw new Error("Account ID is required");
    }

    const supabase = supabaseAdmin;

    // Verify account belongs to user
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("id")
      .eq("id", accountId)
      .eq("user_id", userId)
      .single();

    if (accountError || !account) {
      throw new Error("Account not found");
    }

    const { data: budget, error: budgetError } = await supabase
      .from("budgets")
      .select("*")
      .eq("account_id", accountId)
      .maybeSingle();

    if (budgetError) {
      throw new Error(budgetError.message);
    }

    return JSON.parse(JSON.stringify(budget));
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch budget");
  }
}