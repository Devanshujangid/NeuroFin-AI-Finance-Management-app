import CreateBudgetDrawer from "./CreateBudgetDrawer";
import { Progress } from "@/components/ui/progress";
import EditBudgetDrawer from "./EditBudgetDrawer";


type BudgetCardProps = {
  accountId: string;
  currentMonthExpense: number;
  budget: {
    id: string;
    amount: number;
  } | null;
};

export default function BudgetCard({
  accountId,
  currentMonthExpense,
  budget,
}: BudgetCardProps) {

  const budgetPercentage =
  budget && budget.amount > 0
    ? Math.round(
        (currentMonthExpense /
          budget.amount) *
          100
      )
    : 0;

  // const budgetPercentage=110;

    const progressValue =
  Math.min(
    budgetPercentage,
    100
  );

  const remainingBudget =
  budget
    ? budget.amount -
      currentMonthExpense
    : 0;

  const progressColor =
  budgetPercentage >= 100
    ? "[&>div]:bg-red-500"
    : budgetPercentage >= 90
    ? "[&>div]:bg-orange-500"
    : budgetPercentage >= 80
    ? "[&>div]:bg-yellow-500"
    : "[&>div]:bg-blue-600";


  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">

  <p className="text-xs uppercase tracking-wide text-gray-500">
    Monthly Budget
  </p>

  {budget && (
    <EditBudgetDrawer
      budgetId={budget.id}
      currentAmount={budget.amount}
    />
  )}

</div>

      {budget ? (
  <div className="mt-4">

    <p className="text-2xl font-bold">
  ₹{new Intl.NumberFormat("en-IN").format(
    currentMonthExpense
  )}

  <span className="text-gray-500 font-medium">
    {" "}of{" "}
  </span>

  ₹{new Intl.NumberFormat("en-IN").format(
    budget.amount
  )}

  <span className="text-gray-500 text-lg font-medium">
    {" "}spent
  </span>
</p>

  {remainingBudget >= 0 ? (
  <p className="mt-2 text-sm text-gray-500">
    ₹{new Intl.NumberFormat("en-IN").format(
      remainingBudget
    )} remaining
  </p>
) : (
  <p className="mt-2 text-sm font-medium text-red-600">
    Budget exceeded by ₹
    {new Intl.NumberFormat("en-IN").format(
      Math.abs(remainingBudget)
    )}
  </p>
)}

    
    <div className="mt-4 space-y-2">

 <Progress
  value={progressValue}
  className={progressColor}
/>

  <div className="flex justify-end">

  <span className="text-sm font-medium">
    {budgetPercentage}%
  </span>

</div>

</div>

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