"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createTransaction } from "@/lib/actions/create-transaction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateTransaction } from "@/lib/actions/update-transaction";
import { processReceipt } from "@/lib/actions/process-receipt";
import ReceiptScanner from "@/components/transaction/ReceiptScanner";

type TransactionFormProps = {
  transaction?: {
    id: string;
    account_id: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    description: string | null;
    date: string;
    is_recurring: boolean;
  };
};

export default function TransactionForm({
  transaction,
}: TransactionFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accountId = searchParams.get("accountId");
  const editId = transaction?.id;
  const isEditMode = Boolean(transaction);

  const [amount, setAmount] = useState(
    transaction ? String(transaction.amount) : ""
  );

  const [type, setType] = useState(
    transaction?.type ?? ""
  );

  const [category, setCategory] = useState(
    transaction?.category ?? ""
  );

  const [description, setDescription] = useState(
    transaction?.description ?? ""
  );

  const [date, setDate] = useState(
    transaction
      ? transaction.date.split("T")[0]
      : new Date().toISOString().split("T")[0]
  );

  const [amountManuallyChanged, setAmountManuallyChanged] = useState(false);
const [dateManuallyChanged, setDateManuallyChanged] = useState(false);
const [typeManuallyChanged, setTypeManuallyChanged] = useState(false);
const [categoryManuallyChanged, setCategoryManuallyChanged] = useState(false);
const [descriptionManuallyChanged, setDescriptionManuallyChanged] = useState(false);

  const [isRecurring, setIsRecurring] = useState(
    transaction?.is_recurring ?? false
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentAccountId, setCurrentAccountId] = useState(
    transaction?.account_id ?? accountId ?? ""
  );

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const [isReceiptScanning, setIsReceiptScanning] = useState(false);
const [isReceiptScanSuccess, setIsReceiptScanSuccess] = useState(false);
const [receiptScanError, setReceiptScanError] = useState("");

const handleReceiptScan = async () => {
  if (!receiptFile) {
    return;
  }

  setReceiptScanError("");
  setIsReceiptScanSuccess(false);
  setIsReceiptScanning(true);

  try {
    const formData = new FormData();
    formData.append("receipt", receiptFile);

    const result = await processReceipt(formData);

    console.log("Receipt scan result:", result);
    if (!amountManuallyChanged) {
  setAmount(String(result.receiptData.amount));
}

if (!dateManuallyChanged) {
  setDate(result.receiptData.date);
}

if (!categoryManuallyChanged) {
  setCategory(result.receiptData.category);
}

if (!descriptionManuallyChanged) {
  setDescription(result.receiptData.description);
}

if (!typeManuallyChanged) {
  setType(result.receiptData.type);
}

    setIsReceiptScanSuccess(true);
  } catch (err) {
    console.error("Receipt scanning failed:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Failed to scan receipt";

    setReceiptScanError(message);
  } finally {
    setIsReceiptScanning(false);
  }
};

  // For form submission
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
          date,
          isRecurring,
        });
      } else {
        response = await createTransaction({
          accountId: accountId!,
          amount: Number(amount),
          type: type as "INCOME" | "EXPENSE",
          category,
          description,
          date,
          isRecurring,
        });
      }

      console.log(response);

      toast.success(
        isEditMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );

      router.push(`/account/${currentAccountId}`);
    } catch (err) {
      console.log(err);

      const message =
        err instanceof Error
          ? err.message
          : isEditMode
            ? "Failed to update transaction"
            : "Failed to create transaction";

      toast.error(message);
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

      {/* Receipt Upload */}
       <ReceiptScanner
  onFileSelect={setReceiptFile}
  onScan={handleReceiptScan}
  onRetry={handleReceiptScan}
  isScanning={isReceiptScanning}
  isSuccess={isReceiptScanSuccess}
  error={receiptScanError}
/>

      {/* Amount */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Amount
        </label>

        <Input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => {
  setAmount(e.target.value);
  setAmountManuallyChanged(true);
}}
        />
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Transaction Date
        </label>

        <Input
          type="date"
          value={date}
          onChange={(e) => {
  setDate(e.target.value);
  setDateManuallyChanged(true);
}}
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
          onChange={(e) => {
  setType(e.target.value);
  setTypeManuallyChanged(true);
}}
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
          onChange={(e) => {
  setCategory(e.target.value);
  setCategoryManuallyChanged(true);
}}
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
          onChange={(e) => {
  setDescription(e.target.value);
  setDescriptionManuallyChanged(true);
}}
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