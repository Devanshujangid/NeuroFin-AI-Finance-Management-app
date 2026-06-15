import { inngest } from "./client";
import { supabaseAdmin } from "@/lib/supabase-server";
import { gemini } from "@/lib/ai/gemini";
import {generateRecommendation,} from "@/lib/ai/generate-recommendation";

export const budgetAlertFunction =
  inngest.createFunction(
    {
      id: "budget-alert-function",
      triggers: [
        {
          event: "budget/check",
        },
      ],
    },
    async ({ event }) => {
      console.log(
        "Budget Alert Function Triggered"
      );

      console.log(event);

      return {
        success: true,
      };
    }
  );

export const budgetAlertCron =
  inngest.createFunction(
    {
      id: "budget-alert-cron",
      triggers: [
        {
          cron: "0 */6 * * *",
        },
      ],
    },
    async () => {
      console.log(
        "Gemini Key Exists:",
        !!process.env.GEMINI_API_KEY
      );

      console.log(
  "Gemini Client Created:",
  !!gemini
);

      console.log(
        "Budget Alert Cron Triggered"
      );

      const { data: budgets, error } =
        await supabaseAdmin
          .from("budgets")
          .select(`
            id,
            amount,
            last_alert_level,
            last_alert_sent_at,

            accounts!inner (
              id,
              name,
              user_id,

              users!inner (
                id,
                email
              )
            )
          `);

      if (error) {
        throw new Error(error.message);
      }

      console.log(
        "Budgets Found:",
        budgets?.length || 0
      );

      const firstBudget =
        budgets?.[0] as any; 

        const budgetAmount =
  Number(firstBudget?.amount || 0);

console.log(
  "Budget Amount:",
  budgetAmount
);

      const today = new Date();

      const monthStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      const nextMonthStart =
        new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          1
        );

        const previousMonthStart =
  new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );

const previousMonthEnd =
  monthStart;

      const accountId =
        firstBudget?.accounts?.id;

      const {
        data: transactions,
        error: transactionError,
      } = await supabaseAdmin
        .from("transactions")
        .select(`
          amount,
          type,
          category,
          date
        `)
        .eq(
          "account_id",
          accountId
        )
        .eq(
          "type",
          "EXPENSE"
        )
        .gte(
          "date",
          monthStart.toISOString()
        )
        .lt(
          "date",
          nextMonthStart.toISOString()
        );

      const {
        data: previousMonthTransactions,
        error: previousMonthError,
      } = await supabaseAdmin
        .from("transactions")
        .select(`
          amount,
          type,
          category,
          date
        `)
        .eq(
          "account_id",
          accountId
        )
        .eq(
          "type",
          "EXPENSE"
        )
        .gte(
          "date",
          previousMonthStart.toISOString()
        )
        .lt(
          "date",
          previousMonthEnd.toISOString()
        );

      if (transactionError) {
        throw new Error(
          transactionError.message
        );
      }

      if (previousMonthError) {
        throw new Error(
          previousMonthError.message
        );
      }

      console.log(
        "Transactions Found:",
        transactions?.length || 0
      );

      const totalExpenses =
        transactions?.reduce(
          (sum, transaction) =>
            sum +
            Number(
              transaction.amount
            ),
          0
        ) || 0;

      console.log(
        "Current Month Expense:",
        totalExpenses
      );

      const previousMonthExpenses =
        previousMonthTransactions?.reduce(
          (sum, transaction) =>
            sum +
            Number(transaction.amount),
          0
        ) || 0;

      console.log(
        "Previous Month Expense:",
        previousMonthExpenses
      );

      let monthlyChange = 0;

if (previousMonthExpenses > 0) {
  monthlyChange = Number(
    (
      ((totalExpenses -
        previousMonthExpenses) /
        previousMonthExpenses) *
      100
    ).toFixed(2)
  );
}

console.log(
  "Monthly Change:",
  monthlyChange
);

const currentDayOfMonth =
  today.getDate();

const daysInMonth =
  new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

const dailyAverageSpend =
  currentDayOfMonth > 0
    ? totalExpenses /
      currentDayOfMonth
    : 0;

const projectedMonthEndSpend =
  Number(
    (
      dailyAverageSpend *
      daysInMonth
    ).toFixed(2)
  );

console.log(
  "Projected Month-End Spend:",
  projectedMonthEndSpend
);



  const usagePercentage =
  budgetAmount > 0
    ? Number(
        (
          (totalExpenses /
            budgetAmount) *
          100
        ).toFixed(2)
      )
    : 0;

console.log(
  "Usage Percentage:",
  usagePercentage
);

const remainingAmount =
  budgetAmount - totalExpenses;

console.log(
  "Remaining Amount:",
  remainingAmount
);

const categoryTotals: Record<
  string,
  number
> = {};

transactions?.forEach(
  (transaction) => {
    const category =
      transaction.category ||
      "Uncategorized";

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      Number(transaction.amount);
  }
);

let topCategory =
  "Uncategorized";

let topCategorySpend = 0;

Object.entries(
  categoryTotals
).forEach(
  ([category, amount]) => {
    if (
      amount >
      topCategorySpend
    ) {
      topCategory = category;
      topCategorySpend = amount;
    }
  }
);

console.log(
  "Top Category:",
  topCategory
);

console.log(
  "Top Category Spend:",
  topCategorySpend
);

let riskLevel:
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

if (usagePercentage >= 100) {
  riskLevel = "CRITICAL";
} else if (
  usagePercentage >= 90
) {
  riskLevel = "HIGH";
} else if (
  usagePercentage >= 80
) {
  riskLevel = "MEDIUM";
} else {
  riskLevel = "LOW";
}

console.log(
  "Risk Level:",
  riskLevel
); 

const analytics = {
  budgetAmount,

  spentAmount:
    totalExpenses,

  remainingAmount,

  percentageUsed:
    usagePercentage,

  topCategory,

  topCategorySpend,

  monthlyChange,

  projectedMonthEndSpend,

  riskLevel,
};

const result =
  await generateRecommendation(
    analytics
  );

console.log(
  "AI Recommendation:"
);

console.log(
  result.recommendation
);

console.log(
  "Analytics:",
  analytics
);

      return {
        success: true,
      };
    }
  );