import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { fetchTransactions } from "./store/transactions/transactionsSlice";

// นำเข้าหน้าต่างๆ
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TransactionList from "./pages/TransactionList";
import TransactionForm from "./pages/TransactionForm";
import Layout from "./components/Layout";

// ProtectedRoute สำหรับป้องกันหน้าที่ต้องล็อกอิน
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  // โหลดข้อมูลธุรกรรมเมื่อผู้ใช้ล็อกอินแล้ว
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchTransactions());
    }
  }, [currentUser, dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<TransactionList />} />
        <Route path="transactions/new" element={<TransactionForm />} />
        <Route path="transactions/edit/:id" element={<TransactionForm />} />
      </Route>

      {/* ถ้าไม่มี route ที่ตรง ให้ redirect ไปที่หน้าหลัก */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
