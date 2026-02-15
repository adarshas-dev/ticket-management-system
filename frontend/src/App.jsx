import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import AgentDashboard from "./components/AgentDashboard";
import UserDashboard from "./components/UserDashboard";
import { useAuth } from "./auth/AuthContext";
import TicketDetails from "./components/TicketDetails";
import CreateTicket from "./components/CreateTicket";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import TicketListByStatus from "./components/TicketListByStatus";
import NewAdminAgent from "./components/NewAdminAgent";
import ManageUsers from "./components/ManageUser";
import Profile from "./components/Profile";

function App() {
  const { role } = useAuth();

  return (
    <>
      <div>
        {role && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {role === "ADMIN" && <AdminDashboard />}
                {role === "AGENT" && <AgentDashboard />}
                {role === "USER" && <UserDashboard />}
                {!role && <Navigate to="/login" replace />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tickets/:status"
            element={<TicketListByStatus />}
          />
          <Route
            path="/agent/tickets/:status"
            element={<TicketListByStatus />}
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-user"
            element={
              <ProtectedRoute>
                <NewAdminAgent />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
