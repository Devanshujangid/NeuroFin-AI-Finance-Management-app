// transaction table UI
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Transaction = {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description: string;
  date: string;
  is_recurring: boolean;
};

type Props = {
  transactions: Transaction[];
};

export default function TransactionTable({ transactions }: Props) {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>

            <TableHead>Date</TableHead>

            <TableHead>Description</TableHead>

            <TableHead>Category</TableHead>

            <TableHead>Type</TableHead>

            <TableHead className="text-right">
              Amount
            </TableHead>

            <TableHead>Recurring</TableHead>

          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>

              <TableCell>
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>

              <TableCell>
                {transaction.description}
              </TableCell>

              <TableCell className="capitalize">
                {transaction.category}
              </TableCell>

              <TableCell>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    transaction.type === "INCOME"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.type}
                </span>
              </TableCell>

              <TableCell className="text-right font-medium">
                ₹{transaction.amount}
              </TableCell>

              <TableCell>
                {transaction.is_recurring ? "Yes" : "No"}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}