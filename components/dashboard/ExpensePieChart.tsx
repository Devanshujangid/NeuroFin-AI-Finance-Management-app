import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { getCategoryColor } from "@/lib/category-colors";

type ExpensePieChartProps = {
  pieChartData: {
    name: string;
    value: number;
  }[];
};

export default function ExpensePieChart({
  pieChartData,
}: ExpensePieChartProps) {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Expense Breakdown
      </h2>

      <div className="h-87.5">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {pieChartData.map((entry, index) => (
  <Cell
    key={`cell-${index}`}
    fill={getCategoryColor(entry.name)}
  />
))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}