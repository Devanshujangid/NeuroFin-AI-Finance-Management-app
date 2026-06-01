"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { deleteTransaction } from "@/lib/actions/delete-transaction";
import { bulkDeleteTransactions } from "@/lib/actions/bulk-delete-transaction";

type Transaction = {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description: string;
  is_recurring: boolean;
  date: string;
};

export default function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {

  const router = useRouter();

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // sorting state
  const [sortField, setSortField] = useState<
    "date" | "type" | "amount" | "recurring"
  >("date");

  const [sortOrder, setSortOrder] = useState<
    "asc" | "desc"
  >("desc");

  // filtering state
  const [searchQuery, setSearchQuery] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState<
      "ALL" | "INCOME" | "EXPENSE"
    >("ALL");

  const [recurringFilter, setRecurringFilter] =
    useState<
      "ALL" | "RECURRING" | "NON_RECURRING"
    >("ALL");

  // selection state
  const [
    selectedTransactions,
    setSelectedTransactions,
  ] = useState<string[]>([]);

  // pagination reset protection
  useEffect(() => {

    setCurrentPage(1);

  }, [
    searchQuery,
    typeFilter,
    recurringFilter,
  ]);

  // pagination config
  const transactionsPerPage = 5;

  // filtered dataset
  const filteredTransactions =
    transactions.filter((transaction) => {

      // search filter
      const matchesSearch =

        transaction.description
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )

        ||

        transaction.category
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )

        ||

        transaction.type
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          );

      // type filter
      const matchesType =

        typeFilter === "ALL"

        ||

        transaction.type === typeFilter;

      // recurring filter
      const matchesRecurring =

        recurringFilter === "ALL"

        ||

        (
          recurringFilter ===
          "RECURRING"

          &&

          transaction.is_recurring
        )

        ||

        (
          recurringFilter ===
          "NON_RECURRING"

          &&

          !transaction.is_recurring
        );

      return (
        matchesSearch &&
        matchesType &&
        matchesRecurring
      );
    });

  // sorting logic
  const sortedTransactions =
    [...filteredTransactions].sort(
      (a, b) => {

        // amount sorting
        if (sortField === "amount") {

          return sortOrder === "asc"
            ? Number(a.amount) -
            Number(b.amount)
            : Number(b.amount) -
            Number(a.amount);
        }

        // type sorting
        if (sortField === "type") {

          return sortOrder === "asc"
            ? a.type.localeCompare(
              b.type
            )
            : b.type.localeCompare(
              a.type
            );
        }

        // recurring sorting
        if (sortField === "recurring") {

          const recurringA =
            a.is_recurring
              ? "Yes"
              : "No";

          const recurringB =
            b.is_recurring
              ? "Yes"
              : "No";

          return sortOrder === "asc"
            ? recurringA.localeCompare(
              recurringB
            )
            : recurringB.localeCompare(
              recurringA
            );
        }

        // default date sorting
        return sortOrder === "asc"
          ? new Date(a.date).getTime() -
          new Date(b.date).getTime()
          : new Date(b.date).getTime() -
          new Date(a.date).getTime();
      }
    );

  // pagination math
  const totalPages = Math.ceil(
    sortedTransactions.length /
    transactionsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    transactionsPerPage;

  const endIndex =
    startIndex +
    transactionsPerPage;

  // paginated dataset
  const currentTransactions =
    sortedTransactions.slice(
      startIndex,
      endIndex
    );

  // for selection 
  const currentTransactionIds =
  currentTransactions.map(
    (transaction) => transaction.id
  );

  // for computing all selected states
  const allCurrentPageSelected =
  currentTransactionIds.length > 0 &&
  currentTransactionIds.every((id) =>
    selectedTransactions.includes(id)
  );

  // delete handler
  const handleDelete = async (
    transactionId: string
  ) => {

    try {

      await deleteTransaction(
        transactionId
      );

      toast.success(
        "Transaction deleted successfully"
      );

      router.refresh();

    } catch {

      toast.error(
        "Failed to delete transaction"
      );
    }
  };

  const handleBulkDelete = async () => {

    try {

      await bulkDeleteTransactions(
        selectedTransactions
      );

      toast.success(
        "Transactions deleted successfully"
      );

      setSelectedTransactions([]);  
      router.refresh();

    } catch {

      toast.error(
        "Failed to delete transactions"
      );

    }

  };

  // sorting handler
  const handleSort = (
    field:
      | "date"
      | "type"
      | "amount"
      | "recurring"
  ) => {

    if (sortField === field) {

      setSortOrder((prev) =>
        prev === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSortField(field);

      setSortOrder("desc");
    }
  };

  return (
    <div
      className="
        rounded-2xl
        border
        bg-white
        shadow-sm
        overflow-hidden
      "
    >

      {/* FILTERS */}

      <div
        className="
          flex flex-col sm:flex-row
          gap-4
          p-4
          border-b
          bg-gray-50/50
        "
      >

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(
              e.target.value
            )
          }
          className="
            h-10
            rounded-xl
            border
            px-4
            text-sm
            outline-none
            focus:ring-2
            focus:ring-blue-500
            bg-white
            w-full sm:max-w-sm
          "
        />

        {/* TYPE FILTER */}

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(
              e.target.value as
              | "ALL"
              | "INCOME"
              | "EXPENSE"
            )
          }
          className="
            h-10
            rounded-xl
            border
            px-4
            text-sm
            outline-none
            focus:ring-2
            focus:ring-blue-500
            bg-white
            min-w-[160px]
          "
        >

          <option value="ALL">
            All Types
          </option>

          <option value="INCOME">
            Income
          </option>

          <option value="EXPENSE">
            Expense
          </option>

        </select>

        {/* RECURRING FILTER */}

        <select
          value={recurringFilter}
          onChange={(e) =>
            setRecurringFilter(
              e.target.value as
              | "ALL"
              | "RECURRING"
              | "NON_RECURRING"
            )
          }
          className="
            h-10
            rounded-xl
            border
            px-4
            text-sm
            outline-none
            focus:ring-2
            focus:ring-blue-500
            bg-white
            min-w-[180px]
          "
        >

          <option value="ALL">
            All Transactions
          </option>

          <option value="RECURRING">
            Recurring Only
          </option>

          <option value="NON_RECURRING">
            Non-recurring Only
          </option>

        </select>

       {selectedTransactions.length > 0 && (

  <AlertDialog>

    <AlertDialogTrigger asChild>

      <button
        className="
          h-10
          px-4
          rounded-xl
          bg-red-600
          text-white
          text-sm
          font-medium
          hover:bg-red-700
          transition-colors
        "
      >
        Delete Selected
        ({selectedTransactions.length})
      </button>

    </AlertDialogTrigger>

    <AlertDialogContent>

      <AlertDialogHeader>

        <AlertDialogTitle>
          Delete {selectedTransactions.length} transactions?
        </AlertDialogTitle>

        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>

      </AlertDialogHeader>

      <AlertDialogFooter>

        <AlertDialogCancel>
          Cancel
        </AlertDialogCancel>

        <AlertDialogAction
          onClick={handleBulkDelete}
        >
          Delete
        </AlertDialogAction>

      </AlertDialogFooter>

    </AlertDialogContent>

  </AlertDialog>

)}

      </div>

      {/* TABLE */}

      <Table>

        <TableHeader>

          <TableRow>

            {/* SELECT */}

            <TableHead className="w-[50px]">

  <input
  type="checkbox"
  checked={allCurrentPageSelected}
 onChange={(e) => {

  if (e.target.checked) {

    setSelectedTransactions((prev) => [

      ...new Set([
        ...prev,
        ...currentTransactionIds,
      ]),

    ]);

  } else {

    setSelectedTransactions((prev) =>
      prev.filter(
        (id) =>
          !currentTransactionIds.includes(id)
      )
    );

  }

}}
 className="h-4 w-4 accent-blue-600"
/>

</TableHead>

            {/* DATE */}

            <TableHead
              onClick={() =>
                handleSort("date")
              }
              className="
                cursor-pointer
                hover:text-blue-600
                transition-colors
              "
            >

              <div className="flex items-center gap-1">

                <span>Date</span>

                {sortField === "date" && (
                  <span className="text-blue-600 font-bold text-sm">
                    {sortOrder === "asc"
                      ? "↑"
                      : "↓"}
                  </span>
                )}

              </div>

            </TableHead>

            {/* DESCRIPTION */}

            <TableHead>
              Description
            </TableHead>

            {/* CATEGORY */}

            <TableHead>
              Category
            </TableHead>

            {/* TYPE */}

            <TableHead
              onClick={() =>
                handleSort("type")
              }
              className="
                cursor-pointer
                hover:text-blue-600
                transition-colors
              "
            >

              <div className="flex items-center gap-1">

                <span>Type</span>

                {sortField === "type" && (
                  <span className="text-blue-600 font-bold text-sm">
                    {sortOrder === "asc"
                      ? "↑"
                      : "↓"}
                  </span>
                )}

              </div>

            </TableHead>

            {/* AMOUNT */}

            <TableHead
              onClick={() =>
                handleSort("amount")
              }
              className="
                cursor-pointer
                hover:text-blue-600
                transition-colors
              "
            >

              <div className="flex items-center gap-1">

                <span>Amount</span>

                {sortField === "amount" && (
                  <span className="text-blue-600 font-bold text-sm">
                    {sortOrder === "asc"
                      ? "↑"
                      : "↓"}
                  </span>
                )}

              </div>

            </TableHead>

            {/* RECURRING */}

            <TableHead
              onClick={() =>
                handleSort("recurring")
              }
              className="
                cursor-pointer
                hover:text-blue-600
                transition-colors
              "
            >

              <div className="flex items-center gap-1">

                <span>Recurring</span>

                {sortField === "recurring" && (
                  <span className="text-blue-600 font-bold text-sm">
                    {sortOrder === "asc"
                      ? "↑"
                      : "↓"}
                  </span>
                )}

              </div>

            </TableHead>

            {/* ACTIONS */}

            <TableHead>
              Actions
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {currentTransactions.map(
            (transaction) => (

              <TableRow
                key={transaction.id}
                className="
                  hover:bg-gray-50
                  transition-colors
                "
              >

                {/* SELECT */}

                <TableCell>

                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-600"
                    checked={selectedTransactions.includes(
                      transaction.id
                    )}
                    onChange={(e) => {

                      if (
                        e.target.checked
                      ) {

                        setSelectedTransactions(
                          (prev) => [
                            ...prev,
                            transaction.id,
                          ]
                        );

                      } else {

                        setSelectedTransactions(
                          (prev) =>
                            prev.filter(
                              (id) =>
                                id !==
                                transaction.id
                            )
                        );
                      }
                    }}
                  />

                </TableCell>

                {/* DATE */}

                <TableCell>
                  {new Date(
                    transaction.date
                  ).toLocaleDateString()}
                </TableCell>

                {/* DESCRIPTION */}

                <TableCell>
                  {transaction.description}
                </TableCell>

                {/* CATEGORY */}

                <TableCell>
                  {transaction.category}
                </TableCell>

                {/* TYPE */}

                <TableCell>

                  <span
                    className={
                      transaction.type ===
                        "INCOME"

                        ? `
                          bg-green-100
                          text-green-700
                          px-3 py-1
                          rounded-full
                          text-xs
                          font-medium
                        `

                        : `
                          bg-red-100
                          text-red-700
                          px-3 py-1
                          rounded-full
                          text-xs
                          font-medium
                        `
                    }
                  >
                    {transaction.type}
                  </span>

                </TableCell>

                {/* AMOUNT */}

                <TableCell
                  className={
                    transaction.type ===
                      "INCOME"

                      ? `
                        text-green-600
                        font-medium
                      `

                      : `
                        text-red-600
                        font-medium
                      `
                  }
                >
                  ₹{transaction.amount}
                </TableCell>

                {/* RECURRING */}

                <TableCell>

                  <span
                    className={
                      transaction.is_recurring

                        ? `
                          bg-blue-100
                          text-blue-700
                          px-3 py-1
                          rounded-full
                          text-xs
                          font-medium
                        `

                        : `
                          bg-gray-100
                          text-gray-700
                          px-3 py-1
                          rounded-full
                          text-xs
                          font-medium
                        `
                    }
                  >
                    {transaction.is_recurring
                      ? "Yes"
                      : "No"}
                  </span>

                </TableCell>

                {/* ACTIONS */}

                <TableCell>

                  <DropdownMenu>

                    <DropdownMenuTrigger
                      className="
                        h-8 w-8
                        rounded-full
                        hover:bg-gray-100
                        flex items-center justify-center
                        transition-colors
                      "
                    >
                      ⋯
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                      <DropdownMenuItem asChild>

                        <Link
                          href={`/transaction/create?edit=${transaction.id}`}
                        >
                          Edit
                        </Link>

                      </DropdownMenuItem>

                      <AlertDialog>

                        <AlertDialogTrigger asChild>

                          <DropdownMenuItem
                            onSelect={(e) =>
                              e.preventDefault()
                            }
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>

                        </AlertDialogTrigger>

                        <AlertDialogContent>

                          <AlertDialogHeader>

                            <AlertDialogTitle>
                              Delete Transaction?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>

                          </AlertDialogHeader>

                          <AlertDialogFooter>

                            <AlertDialogCancel>
                              Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() =>
                                handleDelete(
                                  transaction.id
                                )
                              }
                            >
                              Delete
                            </AlertDialogAction>

                          </AlertDialogFooter>

                        </AlertDialogContent>

                      </AlertDialog>

                    </DropdownMenuContent>

                  </DropdownMenu>

                </TableCell>

              </TableRow>
            )
          )}

        </TableBody>

      </Table>

      {/* PAGINATION */}

      <div
        className="
          flex items-center justify-center
          gap-4
          mt-6 mb-6
        "
      >

        <button
          onClick={() =>
            setCurrentPage(
              (prev) => prev - 1
            )
          }
          disabled={currentPage === 1}
          className="
            h-9 w-9
            rounded-full
            border
            flex items-center justify-center
            text-sm font-medium
            hover:bg-gray-100
            disabled:opacity-40
            disabled:cursor-not-allowed
            transition-colors
          "
        >
          {"<"}
        </button>

        <p
          className="
            text-sm
            text-muted-foreground
            font-medium
          "
        >
          Page {currentPage} of{" "}
          {totalPages}
        </p>

        <button
          onClick={() =>
            setCurrentPage(
              (prev) => prev + 1
            )
          }
          disabled={
            currentPage === totalPages
          }
          className="
            h-9 w-9
            rounded-full
            border
            flex items-center justify-center
            text-sm font-medium
            hover:bg-gray-100
            disabled:opacity-40
            disabled:cursor-not-allowed
            transition-colors
          "
        >
          {">"}
        </button>

      </div>

    </div>
  );
}