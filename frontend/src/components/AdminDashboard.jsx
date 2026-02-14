import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/dashboard/stats")
      .then(res => {
        setStats(res.data);
      })
      .catch(err => {
        setError(
          err.response?.status === 403
            ? "Not authorized"
            : "Failed to load stats"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <DashboardLayout>
      <div>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <StatCard
  title="Open"
  value={stats.openTickets}
  onClick={() => navigate("/admin/tickets/OPEN")}
/>

<StatCard
  title="In Progress"
  value={stats.inProgressTickets}
  onClick={() => navigate("/admin/tickets/IN_PROGRESS")}
/>

<StatCard
  title="Resolved"
  value={stats.resolvedTickets}
  onClick={() => navigate("/admin/tickets/RESOLVED")}
/>

<StatCard
  title="Closed"
  value={stats.closedTickets}
  onClick={() => navigate("/admin/tickets/CLOSED")}
/>
      </div>
    </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, onClick }) {
  return (
    <div
      style={{
        border: "1px solid black",
        padding: "20px",
        minWidth: "120px",
        textAlign: "center",
        cursor: "pointer"
      }}
      onClick={onClick}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "24px" }}>{value}</p>
    </div>
  );
}

export default AdminDashboard;