import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import {
  fetchLedgers,
  fetchDashboardData,
} from "../store/transactions/transactionsSlice";
import { format } from "date-fns";
import { FiDollarSign, FiFileText, FiTag, FiArrowLeft } from "react-icons/fi";
import {
  createLedger,
  updateLedger,
  getLedgerById,
  getCategories,
} from "../services/api";

const TransactionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    type: "EXPENSE",
    amount: "",
    ledger_category_id: "",
    date: format(new Date(), "yyyy-MM-dd"),
    remark: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTransactionData = async () => {
      if (id) {
        setIsEditMode(true);
        setLoading(true);

        try {
          const response = await getLedgerById(id);
          const ledger = response.data;

          setFormData({
            type: ledger.type,
            amount: ledger.amount.toString(),
            ledger_category_id: ledger.ledger_category_id.toString(),
            date: format(new Date(ledger.created_at), "yyyy-MM-dd"),
            remark: ledger.remark || "",
          });
        } catch (error) {
          console.error("Error fetching transaction details:", error);
          navigate("/transactions");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactionData();
  }, [id, navigate]);

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

  const handleTypeChange = (type: "INCOME" | "EXPENSE") => {
    setFormData((prev) => ({
      ...prev,
      type,
      ledger_category_id: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.ledger_category_id || !formData.date) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setLoading(true);

    try {
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        ledger_category_id: parseInt(formData.ledger_category_id),
        remark: formData.remark,
      };

      if (isEditMode && id) {
        await updateLedger(id, transactionData);
      } else {
        await createLedger(transactionData);
      }

      dispatch(fetchLedgers({ page: 1, limit: 10 }));
      dispatch(fetchDashboardData({}));

      navigate("/");
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <button
          onClick={() => navigate("/transactions")}
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
                onClick={() => handleTypeChange("INCOME")}
                className={`flex-1 py-3 rounded-md flex justify-center items-center ${
                  formData.type === "INCOME"
                    ? "bg-income text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="font-medium">รายรับ</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange("EXPENSE")}
                className={`flex-1 py-3 rounded-md flex justify-center items-center ${
                  formData.type === "EXPENSE"
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
              htmlFor="ledger_category_id"
              className="block text-gray-700 font-medium mb-2"
            >
              หมวดหมู่ *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiTag />
              </div>
              <select
                id="ledger_category_id"
                name="ledger_category_id"
                value={formData.ledger_category_id}
                onChange={handleChange}
                className="form-input pl-10"
                required
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="remark"
              className="block text-gray-700 font-medium mb-2"
            >
              คำอธิบาย
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FiFileText />
              </div>
              <textarea
                id="remark"
                name="remark"
                value={formData.remark}
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
                formData.type === "INCOME"
                  ? "bg-income text-white hover:bg-green-600"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
              disabled={loading}
            >
              {loading
                ? "กำลังบันทึก..."
                : isEditMode
                ? "บันทึกการแก้ไข"
                : "เพิ่มธุรกรรม"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;