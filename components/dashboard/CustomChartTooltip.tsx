type CustomChartTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

export default function CustomChartTooltip({
  active,
  payload,
  label,
}: CustomChartTooltipProps) {

  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {
    return null;
  }

  const income =
    payload.find(
      (item) => item.dataKey === "income"
    )?.value || 0;

  const expense =
    payload.find(
      (item) => item.dataKey === "expense"
    )?.value || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-[180px]">

      <p className="font-semibold text-gray-900 mb-3">
        {label}
      </p>

      <div className="space-y-2">

        <div className="flex justify-between">
          <span className="text-green-600">
            Income
          </span>

          <span className="font-medium">
            ₹{new Intl.NumberFormat(
              "en-IN"
            ).format(income)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-red-600">
            Expense
          </span>

          <span className="font-medium">
            ₹{new Intl.NumberFormat(
              "en-IN"
            ).format(expense)}
          </span>
        </div>

      </div>

    </div>
  );
}