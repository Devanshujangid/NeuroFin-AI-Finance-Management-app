import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "./supabase-server";

export async function ensureUserExists() {
  console.log("STEP 1: ensureUserExists called");

  const { userId } = await auth();
  console.log("STEP 2: userId =", userId);

  if (!userId) throw new Error("Unauthenticated");

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Clerk user missing");

  // ---------------------------
  // 1. Ensure user
  // ---------------------------
  console.log("STEP 3: querying user...");

  const { data: existingUser, error: userError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId) // ✅ FIXED
    .single();

  if (userError && userError.code !== "PGRST116") {
    throw new Error(userError.message);
  }

  let user = existingUser;

  if (!user) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        id: userId, // ✅ FIXED
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      })
      .select()
      .single();

    if (error) throw error;
    user = data;
  }

  // ---------------------------
  // 2. Ensure default account
  // ---------------------------
  const { data: defaultAccount, error: accError } = await supabaseAdmin
    .from("accounts")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .single();

  if (accError && accError.code !== "PGRST116") {
    throw new Error(accError.message);
  }

  if (!defaultAccount) {
    const { error } = await supabaseAdmin.from("accounts").insert({
      user_id: user.id,
      name: "Main Account",
      type: "savings", // ✅ FIXED (lowercase)
      balance: 0,
      is_default: true,
    });

    if (error) throw error;
  }

  // ---------------------------
  // 3. Ensure budget
  // ---------------------------
  const { data: budget, error: budgetError } = await supabaseAdmin
    .from("budgets")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (budgetError && budgetError.code !== "PGRST116") {
    throw new Error(budgetError.message);
  }

  if (!budget) {
    const { error } = await supabaseAdmin.from("budgets").insert({
      user_id: user.id,
      amount: 0,
    });

    if (error) throw error;
  }

  return user;
}