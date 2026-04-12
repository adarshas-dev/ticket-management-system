import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import StatCard from "./StatCard";
import { Tooltip, PieChart, Pie, ResponsiveContainer } from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      api.get("/dashboard/analytics").then((res) => setAnalytics(res.data));

      api
        .get("/dashboard/stats")
        .then((res) => setStats(res.data))
        .catch((err) => {
          setError(
            err.response?.status === 403
              ? "Not authorized"
              : "Failed to load stats",
          );
        })
        .finally(() => setLoading(false));
    };

    fetchData();

    // auto refresh every 5 sec
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <DashboardLayout>
        <p>Loading dashboard...</p>
      </DashboardLayout>
    );
  if (error)
    return (
      <DashboardLayout>
        <p style={{ color: "red" }}>{error}</p>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
            marginBottom: "30px",
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

      {/* chart */}
      {analytics && (
        <div
          className="dashboard-container"
        >
          {/* Status Chart */}
          <div className="dashboard-card">
            <h4>Tickets by Status</h4>

            <ResponsiveContainer width={"100%"} height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Open", value: analytics.open, fill: "#fd7e14" },
                    {
                      name: "In Progress",
                      value: analytics.inProgress,
                      fill: "#ffc107",
                    },
                    {
                      name: "Resolved",
                      value: analytics.resolved,
                      fill: "#198754",
                    },
                    {
                      name: "Closed",
                      value: analytics.closed,
                      fill: "#6c757d",
                    },
                  ]}
                  dataKey="value"
                  outerRadius={100}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Chart */}
          <div className="dashboard-card">
            <h4>Tickets by Priority</h4>

            <ResponsiveContainer width={"100%"} height={250}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Urgent",
                      value: analytics.urgent,
                      fill: "#dc3545",
                    },
                    { name: "High", value: analytics.high, fill: "#fd7e14" },
                    {
                      name: "Medium",
                      value: analytics.medium,
                      fill: "#ffc107",
                    },
                    { name: "Low", value: analytics.low, fill: "#198754" },
                  ]}
                  dataKey="value"
                  outerRadius={100}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;
