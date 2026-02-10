import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import UserDashboard from "./pages/UserDashboard";
import { useAuth } from "./auth/AuthContext";

function App() {
  const {role} = useAuth();

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
                  {!role && <Navigate to="/login" replace/>}
                </ProtectedRoute>
              }
            />
          </Routes>
      </div>
    </>
  );
}

export default App;
