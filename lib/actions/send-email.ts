"use server";
import React from "react";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

type SendEmailInput = {
  to: string;
  subject: string;
  react: React.ReactNode;
};

export async function sendEmail(
  data: SendEmailInput
) {
  try {
    if (!data.to) {
  throw new Error(
    "Recipient email is required"
  );
}

if (!data.subject) {
  throw new Error(
    "Email subject is required"
  );
}

if (!data.react) {
  throw new Error(
    "Email template is required"
  );
}

    console.log(
  "sendEmail action called"
);

console.log(data);

const result =
  await resend.emails.send({
    from:
      "onboarding@resend.dev",
    to: data.to,
    subject: data.subject,
    react: data.react,
  });

return {
  success: true,
  data: result,
};

  } catch (error) {
    console.error(error);

    return {
  success: false,
  error:
    error instanceof Error
      ? error.message
      : "Failed to send email",
};
  }
}