import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { selectTransactionById } from "../store/transactions/transactionsSelectors";
import {
  addTransaction,
  updateTransaction,
  fetchTransactions,
} from "../store/transactions/transactionsSlice";
import { format } from "date-fns";
import {
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiTag,
  FiArrowLeft,
} from "react-icons/fi";
import { TransactionFormData } from "../types";

const TransactionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const transactionsStatus = useAppSelector(
    (state) => state.transactions.status
  );
  const transaction = useAppSelector((state) =>
    id ? selectTransactionById(state, id) : null
  );

  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    amount: "",
    category: "",
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
  });

  useEffect(() => {
    if (transactionsStatus === "idle" && id) {
      dispatch(fetchTransactions());
    }
  }, [dispatch, id, transactionsStatus]);

  useEffect(() => {
    if (id && transaction) {
      setIsEditMode(true);
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: format(new Date(transaction.date), "yyyy-MM-dd"),
        description: transaction.description,
      });
    } else if (id && transactionsStatus === "succeeded" && !transaction) {
      navigate("/transactions");
    }
  }, [id, transaction, transactionsStatus, navigate]);

  const categoryOptions = {
    income: [
      "เงินเดือน",
      "งานพิเศษ",
      "ของขวัญ",
      "เงินปันผล",
      "ดอกเบี้ย",
      "อื่นๆ",
    ],
    expense: [
      "อาหาร",
      "ค่าเช่า",
      "ค่าน้ำค่าไฟ",
      "การเดินทาง",
      "ความบันเทิง",
      "ช้อปปิ้ง",
      "สุขภาพ",
      "การศึกษา",
      "อื่นๆ",
    ],
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "amount") {
      if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTypeChange = (type: "income" | "expense") => {
    setFormData((prev) => ({
      ...prev,
      type,

      category: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
    };

    try {
      if (isEditMode && id) {
        await dispatch(
          updateTransaction({ id, updatedData: transactionData })
        ).unwrap();
      } else {
        await dispatch(addTransaction(transactionData)).unwrap();
      }

      navigate("/transactions");
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  if (id && transactionsStatus === "loading") {
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
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" />
          ย้อนกลับ
        </button>
      </div>

      <div className="card p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? "แก้ไขธุรกรรม" : "เพิ่มธุรกรรมใหม่"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              ประเภทธุรกรรม
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleTypeChange("income")}
                className={`flex-1 py-3 rounded-md flex justify-center items-center ${
                  formData.type === "income"
                    ? "bg-income text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="font-medium">รายรับ</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange("expense")}
                className={`flex-1 py-3 rounded-md flex justify-center items-center ${
                  formData.type === "expense"
                    ? "bg-expense text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="font-medium">รายจ่าย</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="amount"
              className="block text-gray-700 font-medium mb-2"
            >
              จำนวนเงิน *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiDollarSign />
              </div>
              <input
                id="amount"
                name="amount"
                type="text"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="form-input pl-10"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="category"
              className="block text-gray-700 font-medium mb-2"
            >
              หมวดหมู่ *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiTag />
              </div>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input pl-10"
                required
              >
                <option value="">เลือกหมวดหมู่</option>
                {categoryOptions[formData.type].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="date"
              className="block text-gray-700 font-medium mb-2"
            >
              วันที่ *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiCalendar />
              </div>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input pl-10"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              คำอธิบาย
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FiFileText />
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
                className="form-input pl-10 h-24"
                rows={3}
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              className={`btn ${
                formData.type === "income"
                  ? "bg-income text-white hover:bg-green-600"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              {isEditMode ? "บันทึกการแก้ไข" : "เพิ่มธุรกรรม"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
