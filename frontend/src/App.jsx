import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";

import AdminDashboard from "./components/AdminDashboard";
import AgentDashboard from "./components/AgentDashboard";
import UserDashboard from "./components/UserDashboard";

import TicketDetails from "./components/TicketDetails";
import CreateTicket from "./components/CreateTicket";
import TicketListByStatus from "./components/TicketListByStatus";

import NewAdminAgent from "./components/NewAdminAgent";
import ManageUsers from "./components/ManageUser";
import InactiveUsers from "./components/InactiveUser";
import UserDetails from "./components/UserDetails";
import AdminReports from "./components/AdminReports";

import Profile from "./components/Profile";
import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./auth/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { role } = useAuth();
  const token = localStorage.getItem("token");

  return (
    <>
      {/* Navbar only if logged in */}
      {token && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard (role-based) */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "USER"]}>
              {role === "ADMIN" && <AdminDashboard />}
              {role === "AGENT" && <AgentDashboard />}
              {role === "USER" && <UserDashboard />}
            </ProtectedRoute>
          }
        />

        {/* Tickets */}
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "USER"]}>
              <TicketDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <CreateTicket />
            </ProtectedRoute>
          }
        />

        {/* Ticket lists */}
        <Route
          path="/admin/tickets/:status"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <TicketListByStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent/tickets/:status"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <TicketListByStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/tickets/:status"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <TicketListByStatus />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/create-user"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <NewAdminAgent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/active"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/inactive"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <InactiveUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />

        {/* Common */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "USER"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;