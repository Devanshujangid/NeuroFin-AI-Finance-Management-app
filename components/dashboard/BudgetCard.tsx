import CreateBudgetDrawer from "./CreateBudgetDrawer";
type BudgetCardProps = {
  accountId: string;
  budget: {
    id: string;
    amount: number;
  } | null;
};

export default function BudgetCard({
  accountId,
  budget,
}: BudgetCardProps) {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        Monthly Budget
      </p>

      {budget ? (
        <div className="mt-3">
          <p className="text-3xl font-bold">
            ₹{new Intl.NumberFormat("en-IN").format(budget.amount)}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Budget configured
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">

          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <span className="text-xl">₹</span>
          </div>

          <h3 className="text-lg font-semibold">
            No Budget Set Yet
          </h3>

          <p className="text-sm text-gray-500 mt-2 max-w-md">
            Set a monthly spending limit for this account and track your expenses automatically.
          </p>

          <CreateBudgetDrawer
  accountId={accountId}
/>

        </div>
      )}
    </div>
  );
}