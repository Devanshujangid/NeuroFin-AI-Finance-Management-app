"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "../supabase-server";

export async function deleteTransaction(
  transactionId: string
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { data: transaction, error: transactionError } =
    await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .eq("user_id", userId)
      .single();

  if (transactionError || !transaction) {
    console.log(transactionId);
console.log(userId);
console.log(transactionError);
    throw new Error("Transaction not found");
  }

  const { data: account, error: accountError } =
  await supabaseAdmin
    .from("accounts")
    .select("*")
    .eq("id", transaction.account_id)
    .single();

if (accountError || !account) {
  throw new Error("Account not found");
}

let updatedBalance = Number(account.balance);

if (transaction.type === "INCOME") {
  updatedBalance -= Number(transaction.amount);
} else {
  updatedBalance += Number(transaction.amount);
}

const { error: balanceError } =
  await supabaseAdmin
    .from("accounts")
    .update({
      balance: updatedBalance,
    })
    .eq("id", transaction.account_id);

if (balanceError) {
  throw new Error(balanceError.message);
}


const { error: deleteError } =
  await supabaseAdmin
    .from("transactions")
    .delete()
    .eq("id", transactionId);

if (deleteError) {
  throw new Error(deleteError.message);
}

return {
  success: true,
};

}