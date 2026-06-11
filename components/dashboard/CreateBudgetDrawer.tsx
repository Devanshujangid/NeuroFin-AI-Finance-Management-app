"use client";

import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createBudget } from "@/lib/actions/create-budget";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CreateBudgetDrawerProps = {
  accountId: string;
};

export default function CreateBudgetDrawer({
  accountId,
}: CreateBudgetDrawerProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
  if (loading) return;

  try {
    setLoading(true);

    if (!amount || isNaN(Number(amount))) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    await createBudget({
      accountId,
      amount: Number(amount),
    });

    toast.success("Budget created successfully", {
      description: "Monthly budget has been configured",
    });

    router.refresh();

    setAmount("");
    setOpen(false);

  } catch (error: any) {
    toast.error("Error", {
      description:
        error.message || "Failed to create budget",
    });
  } finally {
    setLoading(false);
  }
}

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setOpen(true)}
        className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
      >
        Set Budget
      </Button>

      {/* Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="p-6">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-semibold">
              Set Monthly Budget
            </DrawerTitle>
          </DrawerHeader>

          <div className="space-y-4 mt-4">
            {/* Budget Amount */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Monthly Budget Amount
              </label>

              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter your monthly spending limit"
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
  className="bg-black text-white hover:bg-gray-800"
  onClick={handleSubmit}
  disabled={loading}
>
  {loading ? "Creating..." : "Create Budget"}
</Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}