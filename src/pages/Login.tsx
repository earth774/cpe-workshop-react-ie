import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiKey, FiCreditCard } from "react-icons/fi";
import { useAppSelector } from "../store/hooks";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const status = useAppSelector((state)=> state.auth.status)
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    localStorage.setItem("access_token", "testing...");
    localStorage.setItem("refresh_token", "testing...");
    console.log("Form submitted with:", { email, password });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/90 text-white p-4 rounded-full shadow-lg shadow-primary/20">
            <FiCreditCard className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
            <h2 className="text-2xl font-bold">เข้าสู่ระบบ</h2>
            <p className="text-primary-50 mt-1">
              ยินดีต้อนรับกลับมาสู่บัญชีของคุณ : {status}
            </p>
          </div>

          <div className="p-8">
            {/* ส่วนแสดงข้อความ error จะถูกเพิ่มที่นี่ */}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <FiMail className="mr-2 text-primary" />
                  อีเมล
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200 outline-none"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="text-gray-700 font-medium flex items-center"
                  >
                    <FiKey className="mr-2 text-primary" />
                    รหัสผ่าน
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary-dark transition-colors duration-200"
                  >
                    ลืมรหัสผ่าน?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  เข้าสู่ระบบ
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                ยังไม่มีบัญชี?{" "}
                <Link
                  to="/register"
                  className="text-primary font-medium hover:text-primary-dark transition-colors duration-200"
                >
                  สมัครสมาชิก
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>© 2025 บันทึกรายรับรายจ่าย. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
