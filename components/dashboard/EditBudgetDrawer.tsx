"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { updateBudget } from "@/lib/actions/update-budget";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

type EditBudgetDrawerProps = {
  budgetId: string;
  currentAmount: number;
};

export default function EditBudgetDrawer({
  budgetId,
  currentAmount,
}: EditBudgetDrawerProps) {
  const [open, setOpen] = useState(false);

  const [amount, setAmount] = useState(
    currentAmount.toString()
  );

  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  async function handleSubmit() {
    if (loading) return;

    try {
      setLoading(true);

      if (
        !amount ||
        isNaN(Number(amount))
      ) {
        toast.error(
          "Please enter a valid budget amount"
        );

        return;
      }

      await updateBudget({
        budgetId,
        amount: Number(amount),
      });

      toast.success(
        "Budget updated successfully",
        {
          description:
            "Monthly budget has been updated",
        }
      );

      router.refresh();

      setOpen(false);

    } catch (error: any) {
      toast.error("Error", {
        description:
          error.message ||
          "Failed to update budget",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger */}
      <button
  onClick={() => setOpen(true)}
  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
>
  <Pencil className="h-4 w-4 text-gray-500" />
</button>

      {/* Drawer */}
      <Drawer
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerContent className="p-6">

          <DrawerHeader>
            <DrawerTitle className="text-xl font-semibold">
              Edit Monthly Budget
            </DrawerTitle>
          </DrawerHeader>

          <div className="space-y-4 mt-4">

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Monthly Budget Amount
              </label>

              <Input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">

              <Button
                variant="outline"
                onClick={() =>
                  setOpen(false)
                }
              >
                Cancel
              </Button>

              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </Button>

            </div>

          </div>

        </DrawerContent>
      </Drawer>
    </>
  );
}