import { getTransaction } from "@/lib/actions/get-transaction";
import { notFound } from "next/navigation";
import TransactionForm from "@/components/transaction/TransactionForm";

type EditTransactionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTransactionPage({
  params,
}: EditTransactionPageProps) {
  const { id } = await params;
  let transaction;

try {
  transaction = await getTransaction(id);
} catch {
  notFound();
}
  

  return (
  <TransactionForm
    transaction={transaction}
  />
);
}