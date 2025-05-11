import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { FiDollarSign, FiFileText, FiTag, FiArrowLeft } from "react-icons/fi";

const TransactionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [categories, setCategories] = useState([
    { id: 1, name: "เงินเดือน", type: "INCOME" },
    { id: 2, name: "โบนัส", type: "INCOME" },
    { id: 3, name: "รายได้เสริม", type: "INCOME" },
    { id: 4, name: "อาหาร", type: "EXPENSE" },
    { id: 5, name: "การเดินทาง", type: "EXPENSE" },
    { id: 6, name: "ความบันเทิง", type: "EXPENSE" },
    { id: 7, name: "ค่าเช่า", type: "EXPENSE" },
    { id: 8, name: "สาธารณูปโภค", type: "EXPENSE" },
  ]);

  const [formData, setFormData] = useState({
    type: "EXPENSE",
    amount: "",
    ledger_category_id: "",
    date: format(new Date(), "yyyy-MM-dd"),
    remark: "",
  });

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      setLoading(true);

      setTimeout(() => {
        const sampleData = {
          type: "EXPENSE",
          amount: "500",
          ledger_category_id: "4",
          date: "2025-05-01",
          remark: "ค่าอาหารกลางวัน",
        };

        setFormData(sampleData);
        setLoading(false);
      }, 500);
    }
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "amount") {
      if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTypeChange = (type: any) => {
    setFormData((prev) => ({
      ...prev,
      type,
      ledger_category_id: "",
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!formData.amount || !formData.ledger_category_id || !formData.date) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      console.log("บันทึกข้อมูล:", {
        ...formData,
        amount: parseFloat(formData.amount),
        ledger_category_id: parseInt(formData.ledger_category_id),
      });

      setLoading(false);
      navigate("/");
    }, 1000);
  };

  const filteredCategories = categories.filter(
    (category) => category.type === formData.type
  );

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
                {filteredCategories.map((category) => (
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
