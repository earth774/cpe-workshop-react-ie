import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiCreditCard } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    console.log("ออกจากระบบ");
    navigate("/login");
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
