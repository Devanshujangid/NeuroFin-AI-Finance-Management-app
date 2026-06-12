import { inngest } from "./client";

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