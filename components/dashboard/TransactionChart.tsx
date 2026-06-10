import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import CustomChartTooltip from "./CustomChartTooltip";

type TransactionChartProps = {
  chartData: any[];
};

export default function TransactionChart({
  chartData,
}: TransactionChartProps) {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Income vs Expense
      </h2>

      <div className="h-[350px]">

  <ResponsiveContainer
    width="100%"
    height="100%"
  >

    <BarChart
      data={chartData}
    >
        <XAxis
    dataKey="date"
        />

        <Tooltip
  content={<CustomChartTooltip />}
/>

        <YAxis />
        <Bar
  dataKey="income"
  fill="#16a34a"
/>
<Bar
  dataKey="expense"
  fill="#dc2626"
/>

    </BarChart>

  </ResponsiveContainer>

</div>
    </div>
  );
}