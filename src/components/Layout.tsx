import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAppSelector } from "../store/hooks";

const Layout = () => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
