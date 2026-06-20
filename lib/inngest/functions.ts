import { inngest } from "./client";
import { supabaseAdmin } from "@/lib/supabase-server";
import { gemini } from "@/lib/ai/gemini";
import { generateRecommendation } from "@/lib/ai/generate-recommendation";
import BudgetAlertEmail from "@/emails/BudgetAlertEmails";
import { sendEmail } from "@/lib/actions/send-email";

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

      console.log(
  "All Budgets:",
  budgets
);

      for (const budget of (budgets || []) as any[]) {
        console.log(
          "Processing Budget:",
          budget.id
        );

        console.log(
          "Account Name:",
          budget.accounts.name
        );

        console.log(
          "Budget Amount:",
          budget.amount
        );

        const lastAlertLevel =
          budget.last_alert_level;

        const budgetAmount =
          Number(budget.amount || 0);

        const accountId =
          budget.accounts.id;


        console.log(
          "Last Alert Level:",
          lastAlertLevel
        );

        console.log(
          "Account ID:",
          accountId
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

const ALERT_80 = 80;
const ALERT_90 = 90;
const ALERT_100 = 100;
let currentAlertLevel = 0;

console.log(
  "Alert Thresholds:",
  {
    ALERT_80,
    ALERT_90,
    ALERT_100,
  }
);

if (usagePercentage >= ALERT_100) {
  currentAlertLevel = 100;
} else if (
  usagePercentage >= ALERT_90
) {
  currentAlertLevel = ALERT_90;
} else if (
  usagePercentage >= ALERT_80
) {
  currentAlertLevel = ALERT_80;
}

console.log(
  "Current Alert Level:",
  currentAlertLevel
);

let shouldSendEmail =
  false;

let alertLevel:
  number | null = null;
let isDuplicateAlert =
  false;

if (
  currentAlertLevel ===
  ALERT_80
) {
  shouldSendEmail = true;

  alertLevel =
    ALERT_80;
}

if (
  currentAlertLevel ===
  ALERT_90
) {
  shouldSendEmail = true;

  alertLevel =
    ALERT_90;
}

if (
  currentAlertLevel ===
  ALERT_100
) {
  shouldSendEmail = true;

  alertLevel =
    ALERT_100;
}

console.log(
  "Should Send Email:",
  shouldSendEmail
);

console.log(
  "Alert Level:",
  alertLevel
);

if (
  lastAlertLevel !== null &&
  currentAlertLevel ===
    lastAlertLevel
) {
  isDuplicateAlert = true;
}

if (isDuplicateAlert) {
  shouldSendEmail = false;
}



console.log(
  "Is Duplicate Alert:",
  isDuplicateAlert
);

console.log(
  "Final Email Decision:",
  shouldSendEmail
);

const decisionEngineOutput = {
  shouldSendEmail,

  alertLevel,

  budgetData: {
    budgetId:
      budget.id,

    budgetAmount,

    spentAmount:
      totalExpenses,

    remainingAmount,

    percentageUsed:
      usagePercentage,

    riskLevel,
  },
};

console.log(
  "Decision Engine Output:",
  decisionEngineOutput,
);


const updatePayload = {
  last_alert_level:
    alertLevel,

  last_alert_sent_at:
    new Date().toISOString(),
};

console.log(
  "Update Payload:",
  updatePayload
);

console.log(
  "Timestamp To Store:",
  updatePayload
    .last_alert_sent_at
);

if (
  shouldSendEmail &&
  alertLevel !== null
) {
  const {
    error: updateError,
  } = await supabaseAdmin
    .from("budgets")
    .update({
      last_alert_level:
        alertLevel,
      last_alert_sent_at:
        new Date().toISOString(),
    })
    .eq(
      "id",
      budget.id
    );

  if (updateError) {
    throw new Error(
      updateError.message
    );
  }

  console.log(
    "Budget Alert Level Updated"
  );
}

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

const emailPayload = {
  userName:
    "Devanshu",

  accountName:
    budget.accounts.name,

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

  aiRecommendation:
    result.recommendation.recommendation,
};

console.log(
  "Email Payload:"
);

console.log(
  emailPayload
);

const emailTemplate =
  BudgetAlertEmail(
    emailPayload
  );

console.log(
  "Email Template Created:",
  !!emailTemplate
);

console.log(
  "Preparing Email Send..."
);

const emailRequest = {
  to:
    budget.accounts
      .users.email,

  subject:
    `NeuroFin Budget Alert - ${budget.accounts.name}`,

  react:
    emailTemplate,
};

console.log(
  "Email Request:"
);

console.log(
  emailRequest
);

if (shouldSendEmail) {
  const emailResult =
    await sendEmail(
      emailRequest
    );

  console.log(
    "Email Result:"
  );

  console.log(
    emailResult
  );
} else {
  console.log(
    "Email Skipped"
  );
}


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

     }

      return {
        success: true,
      };

    }
  );