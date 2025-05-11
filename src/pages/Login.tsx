import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiAlertCircle, FiKey, FiCreditCard } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login, clearError } from "../store/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setIsLoaded(true);

    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(login({ email, password }));
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 p-4">
      <div
        className={`w-full max-w-md transition-all duration-700 ease-out ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex justify-center mb-6">
          <div className="bg-primary/90 text-white p-4 rounded-full shadow-lg shadow-primary/20">
            <FiCreditCard className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
            <h2 className="text-2xl font-bold">เข้าสู่ระบบ</h2>
            <p className="text-primary-50 mt-1">
              ยินดีต้อนรับกลับมาสู่บัญชีของคุณ
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start mb-6 border-l-4 border-red-500 animate-fadeIn">
                <FiAlertCircle className="mr-3 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

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
                  disabled={status === "loading"}
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center space-x-2"
                >
                  {status === "loading" ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>กำลังเข้าสู่ระบบ...</span>
                    </>
                  ) : (
                    <span>เข้าสู่ระบบ</span>
                  )}
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