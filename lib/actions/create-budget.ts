"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { request } from "@arcjet/next";
import { aj } from "@/lib/arcjet";

type CreateBudgetInput = {
  accountId: string;
  amount: number;
};

export async function createBudget(data: CreateBudgetInput) {
  try {
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

    if (!data.accountId) {
      throw new Error("Account is required");
    }

    if (
      data.amount === null ||
      data.amount === undefined ||
      Number.isNaN(data.amount)
    ) {
      throw new Error("Budget amount is required");
    }

    const amount = parseFloat(data.amount.toString());

    if (isNaN(amount) || amount < 0) {
      throw new Error("Invalid budget amount");
    }

    const supabase = supabaseAdmin;

    // Verify account belongs to current user
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("id")
      .eq("id", data.accountId)
      .eq("user_id", userId)
      .single();

    if (accountError || !account) {
      throw new Error("Account not found");
    }

    const { data: budget, error: insertError } = await supabase
      .from("budgets")
      .insert({
        account_id: data.accountId,
        amount,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return JSON.parse(JSON.stringify(budget));
  } catch (error: any) {
    throw new Error(error.message || "Failed to create budget");
  }
}