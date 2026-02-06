import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "./supabase-server";

export async function ensureUserExists() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Clerk user missing");

  // ---------------------------
  // 1. Ensure user
  // ---------------------------
  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  let user = existingUser;

  if (!user) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        clerk_user_id: userId,
        name: clerkUser.fullName ?? "User",
        email: clerkUser.emailAddresses[0].emailAddress,
        image_url: clerkUser.imageUrl,
      })
      .select()
      .single();

    if (error) throw error;
    user = data;
  }

  // ---------------------------
  // 2. Ensure default account
  // ---------------------------
  const { data: defaultAccount } = await supabaseAdmin
    .from("accounts")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .single();

  if (!defaultAccount) {
    const { error } = await supabaseAdmin.from("accounts").insert({
      user_id: user.id,
      name: "Main Account",
      type: "SAVINGS",
      balance: 0,
      is_default: true,
    });

    if (error) throw error;
  }

  // ---------------------------
  // 3. Ensure budget (1:1)
  // ---------------------------
  const { data: budget } = await supabaseAdmin
    .from("budgets")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!budget) {
    const { error } = await supabaseAdmin.from("budgets").insert({
      user_id: user.id,
      amount: 0,
    });

    if (error) throw error;
  }

  return user;
}
