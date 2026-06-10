"use server";

import { supabaseAdmin } from "./supabase-server";

export async function getTransactionsByAccount(accountId: string) {
  // fetch all transactions for one account.
  const supabase = supabaseAdmin;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("account_id", accountId)
    .order("date", { ascending: false }); // for sorted order to appear in transaction table.

  if (error) {
    console.error("Error fetching transactions:", error.message);
    return [];
  }

  return data || [];
}

export async function getTransactionStats(accountId: string) {
  // calculate total income, expenses and net balance and total transactions.
  // this become reusable for charts,anaytics,dashboards and AI
  const transactions = await getTransactionsByAccount(accountId);

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount);

    if (transaction.type === "INCOME") {
      totalIncome += amount;
    } else {
      totalExpense += amount;
    }
  });

  return {
    totalTransactions: transactions.length,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
}

export async function getTransactionById(
  transactionId: string
) {
  const { data, error } =
    await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
