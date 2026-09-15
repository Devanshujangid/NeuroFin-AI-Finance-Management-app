"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "../supabase-server";
import { request } from "@arcjet/next";
import { aj } from "@/lib/arcjet";

export async function getTransaction(
  transactionId: string
) {
   // verify user authentication
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

    console.log("DEBUG [getTransaction]:", { transactionId, userId });

    // fetch transaction by ID
    const { data: transaction, error: transactionError } =
  await supabaseAdmin
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .eq("user_id", userId)
    .single();

    //error handeling
    if (transactionError || !transaction) {
      throw new Error("Transaction not found");
    }

    //serialize the data
    const serializedTransaction = {
       ...transaction,
       amount: Number(transaction.amount),
    };

    return serializedTransaction;
}