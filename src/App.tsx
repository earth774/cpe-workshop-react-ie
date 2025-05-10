import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TransactionList from "./pages/TransactionList";
import TransactionForm from "./pages/TransactionForm";
import Layout from "./components/Layout";

interface RouteProps {
  children: ReactNode;
}

const AuthRoute = ({ children }: RouteProps) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: RouteProps) => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        }
      />

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
