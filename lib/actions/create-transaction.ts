// this file is secure backend entry point for:
// transaction creation
// validation
// database updates.
"use server";

import { auth } from "@clerk/nextjs/server";
import { request } from "@arcjet/next";
import { supabaseAdmin } from "../supabase-server";
import { revalidatePath } from "next/cache";
import { aj } from "../arcjet";

// recieve createTransaction() request
export async function createTransaction(data: {
  accountId: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
  date: string;
  isRecurring: boolean;
}) {
  // Authenticate with clerk
  const { userId } = await auth();

  // if no user id -> Unautorized
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // obtain request with arcjet
  const req = await request();



// we are rate limiting per authenticated user, not per account.
// Arcjet will use userId to identify the user.
// requested: 1, means Creating one transaction consumes one token.
const decision = await aj.protect(req, {
  userId,
  requested: 1,  // Each createTransaction request consumes one token.
});


if (decision.isDenied()) {
  throw new Error("Too many requests. Please try again later.");
}


// verify account belings to authenticated user
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

    // insert transaction into Supabase
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

  // calculate updated account balance
  let updatedBalance = Number(account.balance);

  // update account balance
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


  revalidatePath("/dashboard");
  revalidatePath(`/account/${account.id}`);

  return {
    success: true,
  };

}

