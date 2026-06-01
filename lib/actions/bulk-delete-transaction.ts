"use server";

import { deleteTransaction } from "./delete-transaction";

export async function bulkDeleteTransactions(
  transactionIds: string[]
) {

  for (const transactionId of transactionIds) {

    await deleteTransaction(transactionId);

  }

  return {
    success: true,
  };

}