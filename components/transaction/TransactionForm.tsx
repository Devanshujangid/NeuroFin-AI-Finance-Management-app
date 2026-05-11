"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function TransactionForm() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [error, setError] = useState("");

  // for form submission
  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  setError("");
  if (!amount || !type || !category) {
  setError("Amount, type and category are required");
  return;
}

  console.log({
    accountId,
    amount,
    type,
    category,
    description,
    isRecurring,
  });
};


  return (
    
    <form
  onSubmit={handleSubmit}
  className="max-w-2xl mx-auto bg-white border rounded-2xl p-6 shadow-sm space-y-6"
  >

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Create Transaction
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
      <Button className="w-full">
        Create Transaction
      </Button>
    </form>
  );
}