// this file is secure backend entry point for:
// transaction creation
// validation
// database updates.
"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "../supabase-server";

export async function createTransaction(data: {
  accountId: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
  date: string;
  isRecurring: boolean;
}) {
    const { userId } = await auth();

if (!userId) {
  throw new Error("Unauthorized");
}

const { data: account, error: accountError } = await supabaseAdmin
  .from("accounts")
  .select("*")
  .eq("id", data.accountId)
  .eq("user_id", userId)
  .single();

  if (accountError || !account) {
  throw new Error("Account not found");
}

const { error: transactionError } = await supabaseAdmin

  .from("transactions")
  
  .insert({
    user_id: userId,
    account_id: data.accountId,
    amount: data.amount,
    type: data.type,
    category: data.category,
    description: data.description,
    date: data.date,
    is_recurring: data.isRecurring,
  });

  if (transactionError) {
  throw new Error(transactionError.message);
}

let updatedBalance = Number(account.balance);

if (data.type === "INCOME") {
  updatedBalance += data.amount;
} else {
  updatedBalance -= data.amount;
}

const { error: balanceError } = await supabaseAdmin
  .from("accounts")
  .update({
    balance: updatedBalance,
  })
  .eq("id", data.accountId);

  if (balanceError) {
  throw new Error(balanceError.message);
}

return {
  success: true,
};

}