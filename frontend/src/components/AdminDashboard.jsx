import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <StatCard title="Total Tickets" value={stats.totalTickets} />
        <StatCard title="Open" value={stats.openTickets} />
        <StatCard title="In Progress" value={stats.inProgressTickets} />
        <StatCard title="Resolved" value={stats.resolvedTickets} />
        <StatCard title="Closed" value={stats.closedTickets} />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={{
      border: "1px solid black",
      padding: "20px",
      minWidth: "120px",
      textAlign: "center"
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: "24px" }}>{value}</p>
    </div>
  );
}

export default AdminDashboard;