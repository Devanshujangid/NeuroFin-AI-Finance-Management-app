"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-server";

type UpdateBudgetInput = {
  budgetId: string;
  amount: number;
};

export async function updateBudget(data: UpdateBudgetInput) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (!data.budgetId) {
      throw new Error("Budget ID is required");
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

    // Verify ownership via account relationship
    const { data: budget, error: budgetError } = await supabase
      .from("budgets")
      .select(`
        id,
        account_id,
        accounts!inner (
          user_id
        )
      `)
      .eq("id", data.budgetId)
      .eq("accounts.user_id", userId)
      .single();

    if (budgetError || !budget) {
      throw new Error("Budget not found");
    }

    const { data: updatedBudget, error: updateError } = await supabase
      .from("budgets")
      .update({
        amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.budgetId)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return JSON.parse(JSON.stringify(updatedBudget));
  } catch (error: any) {
    throw new Error(error.message || "Failed to update budget");
  }
}