import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiUser,
  FiAlertCircle,
  FiCreditCard,
  FiKey,
  FiShield,
  FiGlobe,
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { register, clearError } from "../store/auth/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [googleId, setGoogleId] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showGoogleId, setShowGoogleId] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setIsLoaded(true);
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;

    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 1;

    setPasswordStrength(Math.min(strength, 4));
  }, [password]);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 1:
        return "อ่อนมาก";
      case 2:
        return "อ่อน";
      case 3:
        return "ปานกลาง";
      case 4:
        return "แข็งแรง";
      default:
        return "กรุณากรอกรหัสผ่าน";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setValidationError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      setValidationError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setValidationError(null);

    try {
      const userData = {
        name,
        email,
        password,
        ...(googleId && { google_id: googleId }),
      };
      await dispatch(register(userData));
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const toggleGoogleIdField = () => {
    setShowGoogleId(!showGoogleId);
    if (!showGoogleId) {
      setGoogleId("");
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
            <h2 className="text-2xl font-bold">สมัครสมาชิก</h2>
            <p className="text-primary-50 mt-1">
              สร้างบัญชีใหม่เพื่อจัดการการเงินของคุณ
            </p>
          </div>

          <div className="p-8">
            {(validationError || error) && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start mb-6 border-l-4 border-red-500 animate-fadeIn">
                <FiAlertCircle className="mr-3 mt-0.5 flex-shrink-0" />
                <span>{validationError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <FiUser className="mr-2 text-primary" />
                  ชื่อ
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200 outline-none"
                  placeholder="ชื่อของคุณ"
                  required
                />
              </div>

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
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <FiKey className="mr-2 text-primary" />
                  รหัสผ่าน
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200 outline-none"
                  placeholder="••••••••"
                  required
                />

                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs text-gray-500">
                        ความแข็งแรงของรหัสผ่าน:
                      </div>
                      <div
                        className={`text-xs ${
                          passwordStrength <= 1
                            ? "text-red-500"
                            : passwordStrength === 2
                            ? "text-orange-500"
                            : passwordStrength === 3
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {getStrengthText()}
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength * 25}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      รหัสผ่านที่ดีควรมีความยาวอย่างน้อย 8 ตัวอักษร
                      และประกอบด้วยตัวอักษรพิมพ์ใหญ่, พิมพ์เล็ก, ตัวเลข
                      และอักขระพิเศษ
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <FiShield className="mr-2 text-primary" />
                  ยืนยันรหัสผ่าน
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring focus:ring-opacity-20 transition-all duration-200 outline-none ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-primary focus:ring-primary"
                  }`}
                  placeholder="••••••••"
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">รหัสผ่านไม่ตรงกัน</p>
                )}
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={toggleGoogleIdField}
                  className="text-sm text-primary hover:text-primary-dark transition-colors duration-200 flex items-center"
                >
                  <FiGlobe className="mr-1" />
                  {showGoogleId
                    ? "ซ่อน Google ID"
                    : "เพิ่ม Google ID (สำหรับการเชื่อมต่อบัญชี Google)"}
                </button>
              </div>

              {showGoogleId && (
                <div>
                  <label
                    htmlFor="googleId"
                    className="block text-gray-700 font-medium mb-2 flex items-center"
                  >
                    <FiGlobe className="mr-2 text-primary" />
                    Google ID
                  </label>
                  <input
                    id="googleId"
                    type="text"
                    value={googleId}
                    onChange={(e) => setGoogleId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200 outline-none"
                    placeholder="รหัส Google ID ของคุณ (ถ้ามี)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    ใช้สำหรับการเชื่อมต่อกับบัญชี Google ของคุณ
                    (ไม่จำเป็นต้องกรอก)
                  </p>
                </div>
              )}

              <div className="pt-3">
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
                      <span>กำลังสมัครสมาชิก...</span>
                    </>
                  ) : (
                    <span>สมัครสมาชิก</span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                มีบัญชีอยู่แล้ว?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:text-primary-dark transition-colors duration-200"
                >
                  เข้าสู่ระบบ
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

export default Register;
