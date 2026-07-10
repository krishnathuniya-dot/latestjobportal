import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ role }) {
  const adminString = localStorage.getItem("admin");

  // ✅ safe parse (important)
  let adminData = null;
  try {
    adminData = adminString ? JSON.parse(adminString) : null;
  } catch (err) {
    adminData = null;
  }

  // ❌ not logged in
  if (!adminData) {
    return <Navigate to="/admin" replace />;
  }

  // ❌ role mismatch
  if (role && adminData.role !== role) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}