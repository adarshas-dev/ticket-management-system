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
      .then(res => setStats(res.data))
      .catch(err => {
        setError(
          err.response?.status === 403
            ? "Not authorized"
            : "Failed to load stats"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><p>Loading dashboard...</p></DashboardLayout>;
  if (error) return <DashboardLayout><p style={{ color: "red" }}>{error}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
          }}
        >
          <StatCard
            title="Open"
            value={stats.openTickets}
            color="#fd7e14"
            onClick={() => navigate("/admin/tickets/OPEN")}
          />

          <StatCard
            title="In Progress"
            value={stats.inProgressTickets}
            color="#ffc107"
            onClick={() => navigate("/admin/tickets/IN_PROGRESS")}
          />

          <StatCard
            title="Resolved"
            value={stats.resolvedTickets}
            color="#198754"
            onClick={() => navigate("/admin/tickets/RESOLVED")}
          />

          <StatCard
            title="Closed"
            value={stats.closedTickets}
            color="#6c757d"
            onClick={() => navigate("/admin/tickets/CLOSED")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, onClick, color }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#ffffff",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "0.25s ease",
        borderLeft: `6px solid ${color}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
      }}
    >
      <h5 style={{ marginBottom: "10px", color: "#6c757d" }}>{title}</h5>
      <h2 style={{ fontWeight: "700", color }}>{value}</h2>
    </div>
  );
}

export default AdminDashboard;