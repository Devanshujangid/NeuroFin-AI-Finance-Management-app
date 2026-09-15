"use client";

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
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  availableMonths: string[];
};

export default function ExpensePieChart({
  pieChartData,
  selectedMonth,
  setSelectedMonth,
  availableMonths,
}: ExpensePieChartProps) {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Expense Breakdown
        </h2>

        <select
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(e.target.value)
          }
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium"
        >
          {availableMonths.map((month) => {
            const [year, monthNumber] =
              month.split("-");

            const label = new Date(
              Number(year),
              Number(monthNumber) - 1
            ).toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            });

            return (
              <option key={month} value={month}>
                {label}
              </option>
            );
          })}
        </select>
      </div>

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