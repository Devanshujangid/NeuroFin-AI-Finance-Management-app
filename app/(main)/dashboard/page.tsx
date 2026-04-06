import { Plus } from "lucide-react";
import CreateAccountDrawer from "@/components/dashboard/CreateAccountDrawer";
export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="w-full max-w-3xl space-y-6">

        {/* Gradient Heading */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent">
          Dashboard
        </h1>

        {/* Section Title */}
        <h2 className="text-lg font-semibold text-black">
          Your Accounts
        </h2>

        {/* account drawer on clicking the add new account card */}
        <CreateAccountDrawer />

      </div>
    </div>
  );
}