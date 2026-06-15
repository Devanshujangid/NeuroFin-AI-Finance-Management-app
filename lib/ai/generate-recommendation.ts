import { gemini } from "./gemini";

export type AnalyticsInput = {
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
};

export async function generateRecommendation(
  analytics: AnalyticsInput
) {
  try {
    const prompt = `
You are a personal finance advisor.

Analyze the following budget data:

${JSON.stringify(
  analytics,
  null,
  2
)}

Return ONLY valid JSON.

Format:

{
  "insight": "...",
  "risk": "...",
  "recommendation": "..."
}

Rules:
- Keep each field under 40 words.
- No markdown.
- No extra text.
- Return JSON only.
`;

    const response =
      await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    const recommendation =
      JSON.parse(
        response.text || "{}"
      );

    return {
      success: true,
      recommendation,
    };
  } catch (error) {
    console.error(
      "Gemini Error:",
      error
    );

    return {
      success: false,

      recommendation: {
        insight:
          "Spending activity detected for this budget.",

        risk:
          "Unable to generate AI risk analysis.",

        recommendation:
          "Continue monitoring expenses and review spending patterns regularly.",
      },
    };
  }
}