"use server";
// ==========================================
// SERVER ACTION: CREATE ACCOUNT
// This function runs entirely on the server-side.
// It is triggered when the user clicks 'Create Account' in the UI Drawer.
// ==========================================

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// Define the expected structure of the incoming data from the frontend
type CreateAccountInput = {
  name: string;
  type: "current" | "savings";
  balance: number;
  isDefault: boolean;
};

export async function createAccount(data: CreateAccountInput) {
  try {
    // ------------------------------------------
    // 1. AUTHENTICATION CHECK
    // ------------------------------------------
    // We get the currently logged-in user's ID from Clerk.
    // If it doesn't exist, we prevent them from accessing our database.
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Initialize our Supabase instance to interact with the database
    const supabase = supabaseAdmin;

    const name = data.name.trim();
    

    if (!name) {
      throw new Error("Account name is required");
    }
    // ------------------------------------------
    // 2. DATA VALIDATION
    // ------------------------------------------
    // We ensure the balance sent from the frontend is a valid number
    if (
      data.balance === null ||
      data.balance === undefined ||
      Number.isNaN(data.balance)
    ) {
      throw new Error("Balance is required");
    }

    const balance = parseFloat(data.balance.toString());

    if (isNaN(balance)) {
      throw new Error("Invalid balance");
    }

    // ------------------------------------------
    // 3. CHECK FOR EXISTING ACCOUNTS
    // ------------------------------------------
    // We query the database to see if this user already has any accounts.
    // We only need the 'id' to check if any exist, saving DB bandwidth.
    const { data: existingAccounts, error: fetchError } = await supabase
      .from("accounts")
      .select("id")
      .eq("user_id", userId);

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    // Determine if this is the very first account the user is creating. OR if their is no existing accounts exists
    const isFirstAccount = !existingAccounts || existingAccounts.length === 0;

    // ------------------------------------------
    // 4. DETERMINE DEFAULT ACCOUNT STATUS
    // ------------------------------------------
    let isDefault = data.isDefault;

    // RULE: If this is their first account, it MUST be set as the default one.
    if (isFirstAccount) {
      isDefault = true;
    }

    // RULE: If this new account is meant to be the default,
    // we must first remove the default status from all their OTHER accounts.
    if (isDefault) {
      const { error: updateError } = await supabase
        .from("accounts")
        .update({ is_default: false })
        .eq("user_id", userId);

      if (updateError) {
        throw new Error(updateError.message);
      }
    }

    // ------------------------------------------
    // 5. INSERT NEW ACCOUNT INTO DATABASE
    // ------------------------------------------
    const { data: newAccount, error: insertError } = await supabase
      .from("accounts")
      
      .insert({
        name: name,
        type: data.type,
        balance, // Note: storing the float validated earlier
        user_id: userId,
        is_default: isDefault,
      })
      .select() // .select() ensures Postgres returns the newly created row immediately
      .single(); // .single() implies we only expect 1 row object in response, not an array

    if (insertError) {
      throw new Error(insertError.message);
    }

    // ------------------------------------------
    // 6. RETURN SERIALIZED DATA TO CLIENT
    // ------------------------------------------
    // To pass data across the Server to Client boundary safely via Server Actions,
    // we convert the object to JSON and back to strip any non-serializable properties (like Date objects or functions).
    return JSON.parse(JSON.stringify(newAccount));

  } catch (error: any) {
    throw new Error(error.message || "Failed to create account");
  }
}