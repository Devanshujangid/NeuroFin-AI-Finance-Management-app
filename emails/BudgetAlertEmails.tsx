type BudgetAlertEmailProps = {
  userName: string;
  accountName: string;

  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;

  topCategory: string;
  topCategorySpend: number;

  monthlyChange: number;

  projectedMonthEndSpend: number;

  riskLevel:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

  aiRecommendation: string;
};

export default function BudgetAlertEmail({
  userName,
  accountName,

  budgetAmount,
  spentAmount,
  remainingAmount,
  percentageUsed,

  topCategory,
  topCategorySpend,

  monthlyChange,

  projectedMonthEndSpend,

  riskLevel,

  aiRecommendation,
}: BudgetAlertEmailProps) {

 const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", 
    {
    maximumFractionDigits: 0,
  }
).format(amount);

    const alertLabel =
  percentageUsed >= 100
    ? "Critical Budget Alert"
    : percentageUsed >= 90
    ? "High Budget Alert"
    : "Budget Alert";

  return (
  <div
    style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "24px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#ffffff",
      color: "#111827",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
    }}
  >
    <h1
      style={{
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "8px",
      }}
    >
      NeuroFin
    </h1>

   <h2
  style={{
    fontSize: "22px",
    marginBottom: "20px",
  }}
>
  {alertLabel}: {accountName}
</h2>

    <p>
      Hello {userName},
    </p>

    <p>
      You've used{" "}
      <strong>
        {percentageUsed}%
      </strong>{" "}
      of your monthly budget.
    </p>
    <div
  style={{
    marginTop: "24px",
    padding: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    backgroundColor: "#f9fafb",
  }}
>
  <h3
    style={{
      marginTop: 0,
      marginBottom: "16px",
    }}
  >
    Budget Summary
  </h3>

  <p>
    <strong>Budget:</strong> ₹
    {formatCurrency(budgetAmount)}
  </p>

  <p>
    <strong>Spent:</strong> ₹
    {formatCurrency(spentAmount)}
  </p>

  {remainingAmount >= 0 ? (
  <p>
    <strong>Remaining:</strong> ₹
    {formatCurrency(remainingAmount)}
  </p>
) : (
  <p>
    <strong>Exceeded By:</strong> ₹
    {formatCurrency(
      Math.abs(remainingAmount)
    )}
  </p>
)}
  </div>

  <div
    style={{
      marginTop: "24px",
      padding: "20px",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
    }}
  >
    <h3
      style={{
        marginTop: 0,
        marginBottom: "16px",
      }}
    >
      Key Insights
    </h3>

    <p>
      • Top Category:{" "}
      <strong>{topCategory}</strong>
    </p>

    <p>
      • Category Spending: ₹
      {formatCurrency(topCategorySpend)}
    </p>

    <p>
      • Monthly Change:{" "}
      <strong>
        {monthlyChange > 0 ? "+" : ""}
        {monthlyChange.toFixed(1)}%
      </strong>
    </p>

    <p>
      • Projected Month-End Spend: ₹
      {formatCurrency(
        projectedMonthEndSpend
      )}
    </p>

    <p>
      • Risk Level:{" "}
      <strong>{riskLevel}</strong>
    </p>
  </div>

  <div
  style={{
    marginTop: "24px",
    padding: "20px",
    border: "1px solid #dbeafe",
    borderRadius: "12px",
    backgroundColor: "#eff6ff",
  }}
>
  <h3
    style={{
      marginTop: 0,
      marginBottom: "16px",
      color: "#1d4ed8",
    }}
  >
    AI Recommendation
  </h3>

  <p
    style={{
      margin: 0,
      lineHeight: "1.7",
    }}
  >
    {aiRecommendation || "No recommendation available."}
  </p>
</div>

<div
  style={{
    marginTop: "32px",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb",
    color: "#6b7280",
  }}
>
  <p>
    Thank you for using NeuroFin.
  </p>

  <p>
    Your AI-powered finance companion.
  </p>
</div>


  </div>

  

  
);

}