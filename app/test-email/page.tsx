import { auth } from "@clerk/nextjs/server";
import { request } from "@arcjet/next";
import { aj } from "@/lib/arcjet";
import { sendEmail } from "@/lib/actions/send-email";
import BudgetAlertEmail from "@/emails/BudgetAlertEmails";

export default function TestEmailPage() {
  async function handleSend() {
    "use server";

    // ------------------------------------------
    // 1. AUTHENTICATION CHECK
    // ------------------------------------------
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // ------------------------------------------
    // 2. ARCJET PROTECTION
    // ------------------------------------------
    const req = await request();

    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      throw new Error("Too many requests. Please try again later.");
    }

    // ------------------------------------------
    // 3. SEND TEST EMAIL
    // ------------------------------------------
    await sendEmail({
      to: "devanshujangid1234@gmail.com",
      subject: "NeuroFin Test Budget Alert",
      react: (
        <BudgetAlertEmail
          userName="Devanshu"
          accountName="Demo Account"
          budgetAmount={20000}
          spentAmount={17000}
          remainingAmount={3000}
          percentageUsed={85}
          topCategory="Food & Dining"
          topCategorySpend={8500}
          monthlyChange={41.7}
          projectedMonthEndSpend={30000}
          riskLevel="HIGH"
          aiRecommendation="Your spending is heavily concentrated in food-related purchases. At the current pace, you may exceed your budget before month end."
        />
      ),
    });
  }

  return (
    <form action={handleSend}>
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-blue-600 text-white"
      >
        Send Test Email
      </button>
    </form>
  );
}