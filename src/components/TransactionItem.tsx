import { format } from "date-fns";
import { th } from "date-fns/locale";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Transaction } from "../types";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
  const { id, type, amount, category, date, description } = transaction;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP", { locale: th });
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">
        <span
          className={`inline-block w-3 h-3 rounded-full mr-2 ${
            type === "income" ? "bg-income" : "bg-expense"
          }`}
        ></span>
        {formatDate(date)}
      </td>
      <td className="py-3 px-4 font-medium">{category}</td>
      <td className="py-3 px-4 text-gray-500">{description}</td>
      <td
        className={`py-3 px-4 font-medium ${
          type === "income" ? "text-income" : "text-expense"
        }`}
      >
        {type === "income" ? "+" : "-"} {formatCurrency(amount)}
      </td>
      <td className="py-3 px-4">
        <div className="flex space-x-2">
          <Link
            to={`/transactions/edit/${id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEdit2 />
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-700"
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TransactionItem;
