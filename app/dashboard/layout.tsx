// this will run after the login
// database logic is here 
import { ensureUserExists } from "@/lib/ensure-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureUserExists(); // ✅ DB sync happens here
  return children;
}
