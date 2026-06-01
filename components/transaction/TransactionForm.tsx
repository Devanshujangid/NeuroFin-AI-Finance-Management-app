"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSearchParams } from "next/navigation";
import { useEffect , useState } from "react";
import { createTransaction } from "@/lib/actions/create-transaction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getTransactionById } from "@/lib/transactions";
import { updateTransaction } from "@/lib/actions/update-transaction";

export default function TransactionForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accountId = searchParams.get("accountId");
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentAccountId, setCurrentAccountId] =
  useState(accountId || "");

  useEffect(() => {
  async function fetchTransaction() {

    if (!editId) return;

    const transaction =
      await getTransactionById(editId);

    if (!transaction) return;
    setCurrentAccountId(transaction.account_id);

    setAmount(String(transaction.amount));
    setType(transaction.type);
    setCategory(transaction.category);
    setDescription(transaction.description || "");
    setIsRecurring(transaction.is_recurring);
  }

  fetchTransaction();
}, [editId]);


  

  // for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    
  e.preventDefault();

  setError("");
  if (!amount || !type || !category) {
  setError("Amount, type and category are required");
  return;
}

if (!isEditMode && !accountId) {
  setError("No account selected");
  return;
}
setLoading(true);

try {
  let response;

  if (isEditMode && editId) {
    response = await updateTransaction({
      transactionId: editId,
      amount: Number(amount),
      type: type as "INCOME" | "EXPENSE",
      category,
      description,
      isRecurring,
    });
  } else {
    response = await createTransaction({
      accountId: accountId!,
      amount: Number(amount),
      type: type as "INCOME" | "EXPENSE",
      category,
      description,
      isRecurring,
    });
  }

  console.log(response);
  toast.success(isEditMode ? "Transaction updated successfully" : "Transaction created successfully");
  router.push(`/account/${currentAccountId}`);

} catch (err) {
  console.log(err);
  toast.error(isEditMode ? "Failed to update transaction" : "Failed to create transaction");

} finally {
  setLoading(false);
}

};


  return (
    
    <form
  onSubmit={handleSubmit}
  className="max-w-2xl mx-auto bg-white border rounded-2xl p-6 shadow-sm space-y-6"
  >

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
  <span className="bg-linear-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
    {isEditMode
      ? "Edit Transaction"
      : "Create Transaction"}
  </span>
</h1>

        <p className="text-sm text-gray-500 mt-1">
          Add a new income or expense transaction
        </p>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Amount
        </label>

        <Input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Transaction Type
        </label>

        <select
          className="w-full border rounded-lg p-2 text-sm"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Category
        </label>

        <Input
          placeholder="e.g. food, salary, shopping"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Description
        </label>

        <Input
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Recurring */}
      <div className="flex items-center justify-between border rounded-xl p-4">

        <div>
          <p className="font-medium">
            Recurring Transaction
          </p>

          <p className="text-sm text-gray-500">
            Mark this transaction as recurring
          </p>
        </div>

        <Switch
          checked={isRecurring}
          onCheckedChange={setIsRecurring}
        />
      </div>

      {error && (
  <p className="text-sm text-red-500 font-medium">
    {error}
  </p>
)}

      {/* Submit */}
<Button
  type="submit"
  className="w-full"
  disabled={loading}
>
  {loading
    ? isEditMode
      ? "Updating Transaction..."
      : "Creating Transaction..."
    : isEditMode
      ? "Update Transaction"
      : "Create Transaction"}
</Button>

    </form>
  );
}