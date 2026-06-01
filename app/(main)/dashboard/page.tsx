import CreateAccountDrawer from "@/components/dashboard/CreateAccountDrawer";
import { auth } from "@clerk/nextjs/server";
import { getAccounts } from "@/lib/account";

import AccountCard from "@/components/dashboard/AccountCard";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const accounts = (await getAccounts(userId)) || [];

  // Improved Empty State
  if (accounts.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="bg-linear-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>

        <h2 className="text-lg font-semibold text-black">
          Your Accounts
        </h2>

        <CreateAccountDrawer />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="bg-linear-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
        <h2 className="text-lg font-semibold text-black mt-2">
          Your Accounts
        </h2>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

        {/* Add Account Card */}
        <CreateAccountDrawer />

        {/* Accounts */}
        {accounts.map((account) => (
  <AccountCard key={account.id} account={account} />
))}

      </div>
    </div>
  );
}