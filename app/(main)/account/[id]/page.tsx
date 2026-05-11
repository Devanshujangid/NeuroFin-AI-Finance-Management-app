import { auth } from "@clerk/nextjs/server";
import { getAccounts } from "@/lib/account";
import {
  getTransactionsByAccount,
  getTransactionStats,
} from "@/lib/transactions";
import TransactionTable from "@/components/dashboard/TransactionTable";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  //await params (Next.js 16 requirement)
  const { id } = await params;

  const accounts = (await getAccounts(userId)) || [];

  // fetch transactions
  const transactions = await getTransactionsByAccount(id);

  const stats = await getTransactionStats(id);

  //Safe comparison
  const account = accounts.find((acc) => String(acc.id) === String(id));

  if (!account) {
    return <div>Account not found</div>;
  }

  const formattedBalance = new Intl.NumberFormat("en-IN").format(
    account.balance,
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{account.name}</h1>
        <p className="text-sm text-gray-500 capitalize">{account.type}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border rounded-xl p-4 bg-white">
          <p className="text-sm text-gray-500">Current Balance</p>
          <p className="text-2xl font-bold">₹{formattedBalance}</p>
        </div>

        <div className="border rounded-xl p-4 bg-white">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

      <TransactionTable transactions={transactions} />

      {/* Graph Placeholder */}
      <div className="border rounded-xl p-6 bg-white">
        <p className="text-gray-500">Transaction Graph (Coming Soon)</p>
      </div>

      {/* Table Placeholder */}
      <div className="border rounded-xl p-6 bg-white">
        <p className="text-gray-500">Transactions Table (Coming Soon)</p>
      </div>
    </div>
  );
}
