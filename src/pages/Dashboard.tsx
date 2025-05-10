import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  fetchDashboardData,
  fetchLedgers,
  deleteLedgerItem,
  selectLedgers,
  selectLedgerStatus,
  selectPaginationMeta,
} from "../store/transactions/transactionsSlice";
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

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const dashboardData = useAppSelector(
    (state) => state.transactions.dashboardData
  );

  const ledgers = useAppSelector(selectLedgers);
  const ledgerStatus = useAppSelector(selectLedgerStatus);
  const paginationMeta = useAppSelector(selectPaginationMeta);

  console.log("ledgers : ", ledgers);

  const getOneMonthAgoDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  };

  const getOneMonthLaterDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState<string>(getOneMonthAgoDate());
  const [endDate, setEndDate] = useState<string>(getOneMonthLaterDate());

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentType, setCurrentType] = useState<"all" | "income" | "expense">(
    "all"
  );

  const fetchLedgersWithFilters = () => {
    dispatch(
      fetchLedgers({
        page: currentPage,
        limit: pageSize,
        startDate,
        endDate,
        type: currentType,
      })
    );
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleTypeFilter = (type: "all" | "income" | "expense") => {
    setCurrentType(type);
    setCurrentPage(1);
  };

  const handleDeleteLedger = (id: number) => {
    if (window.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) {
      dispatch(deleteLedgerItem(id));
    }
  };

  const handleDateFilterChange = () => {
    dispatch(
      fetchDashboardData({
        startDate,
        endDate,
      })
    );
    fetchLedgersWithFilters();
  };

  useEffect(() => {
    dispatch(
      fetchDashboardData({
        startDate,
        endDate,
      })
    );
    fetchLedgersWithFilters();
  }, [dispatch]);

  useEffect(() => {
    fetchLedgersWithFilters();
  }, [currentPage, pageSize, currentType]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const mappedLedgers = ledgers.map((ledger) => ({
    id: ledger.id.toString(),
    type: ledger.type.toLowerCase() as "income" | "expense",
    amount: ledger.amount,
    category: ledger.ledger_category.name,
    description: ledger.remark,
    date: ledger.created_at,
    createdAt: ledger.created_at,
  }));

  const isLoadingLedgers = ledgerStatus === "loading";

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        บันทึกรายรับรายจ่าย
      </h1>

      <div className="card mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                วันที่เริ่มต้น
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                วันที่สิ้นสุด
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
            <div className="flex items-end mb-[2px]">
              <button
                onClick={handleDateFilterChange}
                className="btn-primary w-full"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="รายรับทั้งหมด"
          amount={dashboardData?.income || 0}
          icon={<FiArrowUpCircle />}
          bgColor="bg-white"
          textColor="text-green-600"
        />

        <DashboardCard
          title="รายจ่ายทั้งหมด"
          amount={dashboardData?.expense || 0}
          icon={<FiArrowDownCircle />}
          bgColor="bg-white"
          textColor="text-red-600"
        />

        <DashboardCard
          title="ยอดคงเหลือ"
          amount={dashboardData?.balance || 0}
          icon={<FiDollarSign />}
          bgColor="bg-white"
          textColor={
            (dashboardData?.balance || 0) >= 0
              ? "text-blue-600"
              : "text-red-600"
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="card lg:col-span-1">
          <div className="border-b pb-4 p-6">
            <h2 className="text-lg font-bold text-gray-800">สรุปตามหมวดหมู่</h2>
          </div>

          <div className="p-4">
            {dashboardData?.ledgerCategories &&
            dashboardData.ledgerCategories.length > 0 ? (
              <ul className="divide-y">
                {dashboardData.ledgerCategories.map((category) => (
                  <li key={category.id} className="py-3">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{category.name}</p>
                      <div className="text-right">
                        {category.balance > 0 && (
                          <p className="text-green-600">
                            + {formatCurrency(category.balance)}
                          </p>
                        )}
                        {category.balance < 0 && (
                          <p className="text-red-600">
                            - {formatCurrency(Math.abs(category.balance))}
                          </p>
                        )}
                        {category.balance === 0 && (
                          <p className="text-gray-500">
                            {formatCurrency(category.balance)}
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
            {isLoadingLedgers ? (
              <div className="flex justify-center items-center p-8">
                <div className="loader">กำลังโหลด...</div>
              </div>
            ) : ledgers.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-3 px-4">วันที่</th>
                        <th className="py-3 px-4">หมวดหมู่</th>
                        <th className="py-3 px-4">คำอธิบาย</th>
                        <th className="py-3 px-4">จำนวนเงิน</th>
                        <th className="py-3 px-4">การดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappedLedgers.map((ledger) => (
                        <TransactionItem
                          key={ledger.id}
                          transaction={ledger}
                          onDelete={() =>
                            handleDeleteLedger(parseInt(ledger.id))
                          }
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t">
                  <Pagination
                    currentPage={paginationMeta.page}
                    totalPages={paginationMeta.totalPages}
                    onPageChange={handlePageChange}
                    pageSize={paginationMeta.limit}
                    onPageSizeChange={handlePageSizeChange}
                    totalItems={paginationMeta.total}
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
