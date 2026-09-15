"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "../supabase-server";
import { revalidatePath } from "next/cache";

import { request } from "@arcjet/next";
import { aj } from "@/lib/arcjet";

export async function updateTransaction(data: {
  transactionId: string;
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

  const { data: existingTransaction, error: transactionError } =
  await supabaseAdmin
    .from("transactions")
    .select("*")
    .eq("id", data.transactionId)
    .eq("user_id", userId)
    .single();

if (transactionError || !existingTransaction) {
  throw new Error("Transaction not found");
}

const { data: account, error: accountError } =
  await supabaseAdmin
    .from("accounts")
    .select("*")
    .eq("id", existingTransaction.account_id)
    .eq("user_id", userId)
    .single();

if (accountError || !account) {
  throw new Error("Account not found");
}

let updatedBalance = Number(account.balance);

if (existingTransaction.type === "INCOME") {
  updatedBalance -= Number(existingTransaction.amount);
} else {
  updatedBalance += Number(existingTransaction.amount);
}

if (data.type === "INCOME") {
  updatedBalance += data.amount;
} else {
  updatedBalance -= data.amount;
}

const { error: balanceError } =
  await supabaseAdmin
    .from("accounts")
    .update({
      balance: updatedBalance,
    })
    .eq("id", existingTransaction.account_id);

if (balanceError) {
  throw new Error(balanceError.message);
}


const { error: updateError } =
  await supabaseAdmin
    .from("transactions")
    .update({
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description,
      date: data.date,
      is_recurring: data.isRecurring,
    })
    .eq("id", data.transactionId);

if (updateError) {
  throw new Error(updateError.message);
}


revalidatePath("/dashboard");
revalidatePath(`/account/${existingTransaction.account_id}`);

return {
  success: true,
};






}