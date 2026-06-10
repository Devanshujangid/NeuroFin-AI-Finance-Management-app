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

type CreateBudgetDrawerProps = {
  accountId: string;
};

export default function CreateBudgetDrawer({
  accountId,
}: CreateBudgetDrawerProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

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
                onClick={() => {
                  console.log({
                    accountId,
                    amount,
                  });
                }}
              >
                Create Budget
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}