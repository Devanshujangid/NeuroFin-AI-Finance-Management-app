"use server";

import { auth } from "@clerk/nextjs/server";
import { request } from "@arcjet/next";
import { aj } from "@/lib/arcjet";
import { gemini } from "@/lib/ai/gemini";

// validate the extracted data by the AI from the receipt 
type ReceiptData = {
    amount: number;
    date: string;
    description: string;
    category: string;
    type: "EXPENSE" | "INCOME";
};

function validateReceiptData(data: unknown): ReceiptData {
    if (
        data === null ||
        typeof data !== "object" ||
        Array.isArray(data)
    ) {
        throw new Error("Gemini returned invalid receipt data");
    }

    const {
        amount,
        date,
        description,
        category,
        type,
    } = data as Record<string, unknown>;

    // Amount
    if (amount === undefined || amount === null) {
        throw new Error("Receipt amount is missing");
    }

    if (
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        throw new Error("Receipt amount is invalid");
    }

    // Date
    if (date === undefined || date === null) {
        throw new Error("Receipt date is missing");
    }

    if (typeof date !== "string") {
        throw new Error("Receipt date is invalid");
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error("Receipt date must be in YYYY-MM-DD format");
    }

    const [year, month, day] = date.split("-").map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    if (
        parsedDate.getUTCFullYear() !== year ||
        parsedDate.getUTCMonth() !== month - 1 ||
        parsedDate.getUTCDate() !== day
    ) {
        throw new Error("Receipt date is invalid");
    }

    // Description
    if (description === undefined || description === null) {
        throw new Error("Receipt description is missing");
    }

    if (typeof description !== "string" || !description.trim()) {
        throw new Error("Receipt description is invalid");
    }

    // Category
    if (category === undefined || category === null) {
        throw new Error("Receipt category is missing");
    }

    if (typeof category !== "string" || !category.trim()) {
        throw new Error("Receipt category is invalid");
    }

    // Type
    if (type === undefined || type === null) {
        throw new Error("Receipt transaction type is missing");
    }

    if (type !== "EXPENSE" && type !== "INCOME") {
        throw new Error(
            "Receipt transaction type must be EXPENSE or INCOME"
        );
    }

    return {
        amount,
        date,
        description,
        category,
        type,
    };
}


export async function processReceipt(formData: FormData) {
    // Authenticate user
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Arcjet rate limit protection
    const req = await request();
    const decision = await aj.protect(req, {
        userId,
        requested: 1,
    });

    if (decision.isDenied()) {
        throw new Error("Too many requests. Please try again later.");
    }

    const file = formData.get("receipt");

    if (!(file instanceof File)) {
        throw new Error("No receipt file provided");
    }

    console.log("Receipt received on server:");
    console.log("Name:", file.name);
    console.log("Type:", file.type);
    console.log("Size:", file.size);

    // Convert image to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Convert ArrayBuffer to Node.js Buffer
    const buffer = Buffer.from(arrayBuffer);

    // Convert image to Base64 for Gemini
    const base64Image = buffer.toString("base64");

    console.log("Receipt image processed for Gemini:");
    console.log("Base64 length:", base64Image.length);

    // Send receipt image to Gemini Vision
    let response;

    try {
        response = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    inlineData: {
                        mimeType: file.type,
                        data: base64Image,
                    },
                },
                {
                    text: `
Analyze this receipt and extract the transaction information.

Return ONLY a JSON object with these fields:

{
  "amount": number,
  "date": "YYYY-MM-DD",
  "description": "string",
  "category": "string",
  "type": "EXPENSE" | "INCOME"
}

Rules:
- amount must be the final transaction amount.
- date must be in YYYY-MM-DD format.
- description should briefly describe the transaction.
- category should represent the main spending category.
- type should be EXPENSE for a purchase receipt.
- Do not include markdown.
- Do not include explanations.
- Return only valid JSON.
        `,
                },
            ],
        });
    } catch (error) {
        console.error("Gemini receipt processing failed:", error);

        throw new Error(
            "Unable to process receipt. Please try again later."
        );
    }

    console.log("Gemini Vision response:");
    console.log(response.text);

    // Parse Gemini JSON response
    const responseText = response.text;

    if (!responseText) {
        throw new Error("Gemini returned an empty response");
    }

    let parsedReceiptData: unknown;

    try {
        parsedReceiptData = JSON.parse(responseText);
    } catch (error) {
        console.error("Failed to parse Gemini response:", error);

        throw new Error(
            "Gemini returned invalid receipt data. Please try again."
        );
    }

    console.log("Parsed receipt data:");
    console.log(parsedReceiptData);

    const receiptData = validateReceiptData(parsedReceiptData);

    console.log("Validated receipt data:");
    console.log(receiptData);

    return {
        success: true,
        receiptData,
    };


}