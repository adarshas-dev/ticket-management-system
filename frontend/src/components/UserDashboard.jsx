import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import DashboardLayout from "../layout/DashboardLayout";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import ThemeTable from "./ThemeTable";
import StatCard from "./StatCard";

function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/tickets/my")
      .then((res) => {
        setTickets(res.data);
      })
      .catch((err) => {
        setError(
          err.response?.status === 403
            ? "Not authorized"
            : "Failed to load tickets",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    api.get("/dashboard/customer-stats").then((res) => setStats(res.data));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  console.log("TICKETS DATA:", tickets);
  return (
    <DashboardLayout>
      <div>
        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <StatCard
            title="Total Tickets"
            value={stats.total}
            color="#0d6efd"
            onClick={() => navigate("/user/tickets/ALL")}
          />
          <StatCard
            title="Open"
            value={stats.open}
            color="#fd7e14"
            onClick={() => navigate("/user/tickets/OPEN")}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            color="#ffc107"
            onClick={() => navigate("/user/tickets/IN_PROGRESS")}
          />
          <StatCard
            title="Resolved"
            value={stats.resolved}
            color="#198754"
            onClick={() => navigate("/user/tickets/RESOLVED")}
          />
          <StatCard
            title="Closed"
            value={stats.closed}
            color="#6c757d"
            onClick={() => navigate("/user/tickets/CLOSED")}
          />
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 className="text-format">My Tickets</h2>

          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            style={{ maxWidth: "300px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <ThemeTable>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">
                  <div className="text-center">
                    <div className="spinner-border text-primary"></div>
                  </div>
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan="5">No tickets found</td>
              </tr>
            ) : (
              tickets
                .filter((t) => {
                  const q = search.toLowerCase();

                  return (
                    t.title?.toLowerCase().includes(q) ||
                    t.status?.replace("_", " ").toLowerCase().includes(q) ||
                    t.priority?.toLowerCase().includes(q)
                  );
                })
                .map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/tickets/${t.id}`, { state: t })}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{t.id}</td>
                    <td>{t.title}</td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td>
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
            )}
          </tbody>
        </ThemeTable>
      </div>
    </DashboardLayout>
  );
}
export default UserDashboard;
