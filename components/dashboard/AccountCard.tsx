"use client";

import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setDefaultAccount } from "@/lib/actions/set-default-account";

export default function AccountCard({ account }: any) {
  const router = useRouter();

  async function handleSwitch() {
    try {
      await setDefaultAccount(account.id);

      toast.success("Default account updated");

      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update default account");
    }
  }

  const formattedBalance = new Intl.NumberFormat("en-IN").format(account.balance);

  return (
    <div
      onClick={() => router.push(`/account/${account.id}`)}
      className={`
        rounded-2xl p-4 transition-all cursor-pointer
        border
        hover:shadow-md hover:-translate-y-0.5
        ${
          account.is_default
            ? "bg-blue-50 border-blue-500 ring-1 ring-blue-200 shadow-md"
            : "border-gray-200 bg-white"
        }
      `}
    >
      <div className="flex justify-between items-start">

        <div className="space-y-1">
          <h3 className="font-semibold text-base">{account.name}</h3>
          <p className="text-gray-400 text-xs uppercase tracking-wide">{account.type}</p>
          <p className={`text-2xl font-bold tracking-tight mt-1 ${account.balance <= 0 ? "text-red-500" : "text-gray-900"}`}>
            ₹{formattedBalance}
          </p>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={account.is_default}
            className="data-[state=checked]:bg-blue-600"
            onCheckedChange={handleSwitch}
          />
        </div>

      </div>
    </div>
  );
}