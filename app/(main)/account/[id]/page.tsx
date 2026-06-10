import { auth } from "@clerk/nextjs/server";
import { getAccounts } from "@/lib/account";
import {
  getTransactionsByAccount,
  getTransactionStats,
} from "@/lib/transactions";
import TransactionTable from "@/components/dashboard/TransactionTable";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import { getBudget } from "@/lib/actions/get-budget";
import BudgetCard from "@/components/dashboard/BudgetCard";

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
  const budget = await getBudget(id); 
  console.log("Budget:", budget); 

  //Safe comparison
  const account = accounts.find((acc) => String(acc.id) === String(id));

  if (!account) {
    return <div>Account not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-linear-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
            {account.name}
          </span>
        </h1>
        <p className="text-sm text-gray-500 capitalize">{account.type}</p>
      </div>

      <BudgetCard
  accountId={id}
  budget={budget}
/>

      <AnalyticsSection
        transactions={transactions}
        currentBalance={account.balance}
        stats={stats}
      />
      
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <TransactionTable transactions={transactions} />
      </div>

    </div>
  );
}
