import { Link } from "react-router-dom";
import { FiLogOut, FiUser, FiCreditCard } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/auth/authSlice";

const Navbar = () => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
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
          {currentUser && (
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <FiUser className="mr-2" />
                <span>{currentUser.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:text-gray-200"
              >
                <FiLogOut className="mr-1" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
