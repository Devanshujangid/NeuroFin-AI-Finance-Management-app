"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { createAccount } from "@/lib/actions/create-account";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateAccountDrawer() {
  const [open, setOpen] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [type, setType] = useState<"current" | "savings" | "">("");
  const [balance, setBalance] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // error state
  const [errors, setErrors] = useState<{
    name?: string;
    type?: string;
    balance?: string;
  }>({});

  async function handleSubmit() {
    if (loading) return; // prevent double click

    try {
      setLoading(true);

      const newErrors: any = {};

      // validation
      if (!name.trim()) {
        newErrors.name = "Account name is required";
      }

      if (!type) {
        newErrors.type = "Account type is required";
      }

      if (balance === "" || isNaN(Number(balance))) {
        newErrors.balance = "Valid balance is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        setLoading(false);
        return;
      }

      await createAccount({
        name,
        type: type as "current" | "savings",
        balance: Number(balance),
        isDefault,
        
      });
      toast.success("Account created successfully", {
      description: "Your new account is ready to use",
});

      router.refresh();
      // reset form
      setName("");
      setType("");
      setBalance("");
      setIsDefault(false);
      setErrors({});
      setOpen(false);

    } catch (error: any) {
      toast.error("Error", {
  description: error.message || "Something went wrong",
});
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger Card */}
      <div className="w-fit">
        <div
          onClick={() => setOpen(true)}
          className="border border-gray-300 rounded-2xl px-8 py-6 flex flex-col items-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
        >
          <Plus className="w-8 h-8 text-black" />
          <span className="text-sm font-medium text-black">
            Add New Account
          </span>
        </div>
      </div>

      {/* Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="p-6">

          <DrawerHeader>
            <DrawerTitle className="text-xl font-semibold">
              Create New Account
            </DrawerTitle>
          </DrawerHeader>

          <div className="space-y-4 mt-4">

            {/* Account Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Account Name</label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g. HDFC Savings"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">* {errors.name}</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Account Type</label>
              <Select
                onValueChange={(val: "current" | "savings") => {
                  setType(val);
                  setErrors((prev) => ({ ...prev, type: undefined }));
                }}
              >
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">* {errors.type}</p>
              )}
            </div>

            {/* Balance */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Initial Balance</label>
              <Input
                type="number"
                value={balance}
                onChange={(e) => {
                  setBalance(e.target.value);
                  setErrors((prev) => ({ ...prev, balance: undefined }));
                }}
                placeholder="0.00"
                className={errors.balance ? "border-red-500" : ""}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">* {errors.balance}</p>
              )}
            </div>

            {/* Default */}
            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                checked={isDefault}
                onCheckedChange={(val) => setIsDefault(!!val)}
              />
              <label className="text-sm">
                Set as default account
              </label>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading && (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </div>

          </div>

        </DrawerContent>
      </Drawer>
    </>
  );
}