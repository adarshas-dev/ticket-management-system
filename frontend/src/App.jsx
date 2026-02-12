import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import AgentDashboard from "./components/AgentDashboard";
import UserDashboard from "./components/UserDashboard";
import { useAuth } from "./auth/AuthContext";
import TicketDetails from "./components/TicketDetails";

function App() {
  const { role } = useAuth();

  return (
    <>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
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
        </Routes>
      </div>
    </>
  );
}

export default App;
