"use client";
import { useState } from "react";
import TransactionChart from "./TransactionChart";

type AnalyticsSectionProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: any[];
  currentBalance: number;
  stats: {
    totalTransactions: number;
    totalIncome: number;
    totalExpense: number;
  };
};

export default function AnalyticsSection({
  transactions,
  currentBalance,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stats,
}: AnalyticsSectionProps) {

  const formattedBalance =
    new Intl.NumberFormat("en-IN").format(
      currentBalance
    );

  const [timeRange, setTimeRange] =
  useState("1M");

  const filteredTransactions =
  transactions.filter((transaction) => {

    const transactionDate =
      new Date(transaction.date);

    const now = new Date();

    if (timeRange === "7D") {

      const sevenDaysAgo = new Date();

      sevenDaysAgo.setDate(
        now.getDate() - 7
      );

      return transactionDate >= sevenDaysAgo;
    }

    if (timeRange === "1M") {

      const oneMonthAgo = new Date();

      oneMonthAgo.setMonth(
        now.getMonth() - 1
      );

      return transactionDate >= oneMonthAgo;
    }

    if (timeRange === "3M") {

      const threeMonthsAgo = new Date();

      threeMonthsAgo.setMonth(
        now.getMonth() - 3
      );

      return transactionDate >= threeMonthsAgo;
    }

    return true;
  });

  const filteredStats = filteredTransactions.reduce(
    (acc, transaction) => {

      const amount = Number(
        transaction.amount
      );

      if (transaction.type === "INCOME") {
        acc.totalIncome += amount;
      } else {
        acc.totalExpense += amount;
      }

      return acc;
    },
    {
      totalIncome: 0,
      totalExpense: 0,
    }
  );

  const chartDataMap = new Map();

filteredTransactions.forEach((transaction) => {

  const date = new Date(
    transaction.date
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  if (!chartDataMap.has(date)) {

    chartDataMap.set(date, {
      date,
      income: 0,
      expense: 0,
    });

  }

  const currentDay =
    chartDataMap.get(date);

  if (transaction.type === "INCOME") {

    currentDay.income += Number(
      transaction.amount
    );

  } else {

    currentDay.expense += Number(
      transaction.amount
    );

  }

});

const chartData =
  Array.from(
    chartDataMap.values()
  );



  return (
    <div className="space-y-5">

      <div className="flex items-center gap-2">

        <button
          onClick={() => setTimeRange("7D")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            timeRange === "7D"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          7 Days
        </button>

        <button
          onClick={() => setTimeRange("1M")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            timeRange === "1M"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          1 Month
        </button>

        <button
          onClick={() => setTimeRange("3M")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            timeRange === "3M"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          3 Months
        </button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Current Balance
          </p>
          <p className="mt-2 text-3xl font-bold">
            ₹{formattedBalance}
          </p>
        </div>

        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Total Transactions
          </p>
          <p className="mt-2 text-3xl font-bold">
            {filteredTransactions.length}
          </p>
        </div>

        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Total Income
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            ₹{new Intl.NumberFormat("en-IN").format(
              filteredStats.totalIncome
            )}
          </p>
        </div>

        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Total Expense
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            ₹{new Intl.NumberFormat("en-IN").format(
              filteredStats.totalExpense
            )}
          </p>
        </div>

        

      </div>

      <TransactionChart
        chartData={chartData}
      />

    </div>
  );
}