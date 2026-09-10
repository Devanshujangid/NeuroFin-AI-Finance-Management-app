import { Suspense } from "react";
import TransactionForm from "@/components/transaction/TransactionForm";
import { Divide } from "lucide-react";

export default function CreateTransactionPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<div>Loading form...</div>}>
        <TransactionForm />
      </Suspense>
    </div>
  );
}