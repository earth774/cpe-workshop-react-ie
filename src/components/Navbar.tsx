import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiCreditCard } from "react-icons/fi";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/auth/authSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className={`p-2 rounded-full mr-2`}>
                <FiCreditCard className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">บันทึกรายรับรายจ่าย</span>
            </Link>
          </div>
          {
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:text-gray-200"
              >
                <FiLogOut className="mr-1" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
