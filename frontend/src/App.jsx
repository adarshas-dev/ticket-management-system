import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import UserDashboard from "./pages/UserDashboard";
import { getUserRole } from "./utils/jwt";

function App() {
  // useEffect(() => {
  //   api
  //     .get("/dashboard/stats")
  //     .then((res) => console.log("Backend connected: ", res.data))
  //     .catch((err) => console.log("Error: ", err.response?.status));
  // }, []);

  const role = getUserRole();

  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  {role === "ADMIN" && <AdminDashboard />}
                  {role === "AGENT" && <AgentDashboard />}
                  {role === "USER" && <UserDashboard />}
                  {!role && <Navigate to="/login" />}
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
