import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  fetchTransactions,
  deleteTransaction,
} from "../store/transactions/transactionsSlice";
import {
  selectIncomeSummary,
  selectExpenseSummary,
  selectBalanceSummary,
  selectCategorySummary,
} from "../store/transactions/transactionsSelectors";
import TransactionItem from "../components/TransactionItem";
import Pagination from "../components/Pagination";
import DashboardCard from "../components/DashboardCard";
import {
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiDollarSign,
  FiPlusCircle,
  FiFilter,
} from "react-icons/fi";
import { Transaction } from "../types";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(
    (state) => state.transactions.transactions
  );
  const status = useAppSelector((state) => state.transactions.status);

  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentType, setCurrentType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"date" | "amount" | "category">(
    "date"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const incomeSummary = useAppSelector(selectIncomeSummary);
  const expenseSummary = useAppSelector(selectExpenseSummary);
  const balanceSummary = useAppSelector(selectBalanceSummary);
  const categories = useAppSelector(selectCategorySummary);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTransactions());
    }
  }, [dispatch, status]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    return filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredTransactions, currentPage, pageSize]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (newSize: number) => {
    const firstItemIndex = (currentPage - 1) * pageSize;

    setPageSize(newSize);

    const newCurrentPage = Math.floor(firstItemIndex / newSize) + 1;
    setCurrentPage(newCurrentPage);
  };

  const handleTypeFilter = (type: "all" | "income" | "expense") => {
    setCurrentType(type);
    setCurrentPage(1);
  };

  const handleSort = (field: "date" | "amount" | "category") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) {
      dispatch(deleteTransaction(id));
    }
  };

  useEffect(() => {
    let result = [...transactions];

    if (currentType !== "all") {
      result = result.filter((item) => item.type === currentType);
    }

    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.category.toLowerCase().includes(searchLower) ||
          (item.description &&
            item.description.toLowerCase().includes(searchLower))
      );
    }

    result.sort((a, b) => {
      let comparison = 0;

      if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortField === "category") {
        comparison = a.category.localeCompare(b.category);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredTransactions(result);
  }, [transactions, currentType, searchTerm, sortField, sortDirection]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (status === "loading") {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        บันทึกรายรับรายจ่าย
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="รายรับทั้งหมด"
          amount={incomeSummary}
          icon={<FiArrowUpCircle />}
          bgColor="bg-white"
          textColor="text-green-600"
        />

        <DashboardCard
          title="รายจ่ายทั้งหมด"
          amount={expenseSummary}
          icon={<FiArrowDownCircle />}
          bgColor="bg-white"
          textColor="text-red-600"
        />

        <DashboardCard
          title="ยอดคงเหลือ"
          amount={balanceSummary}
          icon={<FiDollarSign />}
          bgColor="bg-white"
          textColor={balanceSummary >= 0 ? "text-blue-600" : "text-red-600"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="card lg:col-span-1">
          <div className="border-b pb-4 p-6">
            <h2 className="text-lg font-bold text-gray-800">สรุปตามหมวดหมู่</h2>
          </div>

          <div className="p-4">
            {categories.length > 0 ? (
              <ul className="divide-y">
                {categories.map((category, index) => (
                  <li key={index} className="py-3">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{category.name}</p>
                      <div className="text-right">
                        {category.income > 0 && (
                          <p className="text-green-600">
                            + {formatCurrency(category.income)}
                          </p>
                        )}
                        {category.expense > 0 && (
                          <p className="text-red-600">
                            - {formatCurrency(category.expense)}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 text-gray-500">
                ไม่มีข้อมูลหมวดหมู่
              </div>
            )}
          </div>
        </div>

        <div className="card lg:col-span-3">
          <div className="flex justify-between items-center border-b pb-4 p-6">
            <h2 className="text-lg font-bold text-gray-800">รายการธุรกรรม</h2>
            <Link
              to="/transactions/new"
              className="btn-primary flex items-center"
            >
              <FiPlusCircle className="mr-2" />
              เพิ่มธุรกรรม
            </Link>
          </div>

          <div className="p-4 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <FiFilter className="mr-2" />
                  ประเภทธุรกรรม
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleTypeFilter("all")}
                    className={`px-3 py-1 rounded-md ${
                      currentType === "all"
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    ทั้งหมด
                  </button>
                  <button
                    onClick={() => handleTypeFilter("income")}
                    className={`px-3 py-1 rounded-md ${
                      currentType === "income"
                        ? "bg-income text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    รายรับ
                  </button>
                  <button
                    onClick={() => handleTypeFilter("expense")}
                    className={`px-3 py-1 rounded-md ${
                      currentType === "expense"
                        ? "bg-expense text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    รายจ่าย
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden">
            {filteredTransactions.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th
                          className="py-3 px-4 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("date")}
                        >
                          วันที่
                          {sortField === "date" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </th>
                        <th
                          className="py-3 px-4 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("category")}
                        >
                          หมวดหมู่
                          {sortField === "category" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </th>
                        <th className="py-3 px-4">คำอธิบาย</th>
                        <th
                          className="py-3 px-4 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("amount")}
                        >
                          จำนวนเงิน
                          {sortField === "amount" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </th>
                        <th className="py-3 px-4">การดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((transaction) => (
                        <TransactionItem
                          key={transaction.id}
                          transaction={transaction}
                          onDelete={handleDeleteTransaction}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    totalItems={filteredTransactions.length}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                  />
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-gray-500">
                ไม่พบรายการธุรกรรมที่ตรงกับเงื่อนไข
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
