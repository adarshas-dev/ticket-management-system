import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import StatCard from "../components/StatCard";
import ThemeTable from "./ThemeTable";

function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [priorityTickets, setPriorityTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unread, setUnread] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const navigate = useNavigate();

  // FILTER
  const filteredTickets = tickets.filter((t) => {
    const q = search.toLowerCase();

    return (
      t.title?.toLowerCase().includes(q) &&
      (statusFilter ? t.status === statusFilter : true) &&
      (priorityFilter ? t.priority === priorityFilter : true)
    );
  });

  // SORT
  const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const statusOrder = { OPEN: 0, IN_PROGRESS: 1, RESOLVED: 2, CLOSED: 3 };

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const statusDiff =
      (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
    if (statusDiff !== 0) return statusDiff;

    const priorityDiff =
      (priorityOrder[a.priority] ?? 99) -
      (priorityOrder[b.priority] ?? 99);
    if (priorityDiff !== 0) return priorityDiff;

    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  useEffect(() => {
    const fetchData = () => {
      api
        .get("/tickets/assigned")
        .then((res) => setTickets(res.data))
        .catch((err) => {
          setError(
            err.response?.status === 403
              ? "Not authorized"
              : "Failed to load tickets"
          );
        })
        .finally(() => setLoading(false));

      api.get("/dashboard/agent-stats").then((res) => setStats(res.data));
      api.get("/tickets/agent/priority-tickets").then((res) =>
        setPriorityTickets(res.data)
      );
      api.get("/tickets/agent/unread-count").then((res) =>
        setUnread(res.data)
      );
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    setTimeout(() => {
      api.put("/tickets/agent/mark-seen");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div>

        {/* 🔹 ERROR */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* 🔹 FILTER */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search tickets..."
            className="form-control"
            style={{ maxWidth: "250px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-select"
            style={{ maxWidth: "180px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            className="form-select"
            style={{ maxWidth: "180px" }}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* 🔹 NOTIFICATION */}
        {unread > 0 && (
          <div className="alert alert-warning">
            🔔 {unread} new tickets assigned
          </div>
        )}

        {/* 🔹 STATS */}
        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "25px",
            }}
          >
            <StatCard
              title="Open"
              value={stats.openTickets}
              color="#fd7e14"
              onClick={() => navigate("/agent/tickets/OPEN")}
            />
            <StatCard
              title="In Progress"
              value={stats.inProgressTickets}
              color="#ffc107"
              onClick={() => navigate("/agent/tickets/IN_PROGRESS")}
            />
            <StatCard
              title="Resolved"
              value={stats.resolvedTickets}
              color="#198754"
              onClick={() => navigate("/agent/tickets/RESOLVED")}
            />
            <StatCard
              title="Closed"
              value={stats.closedTickets}
              color="#6c757d"
              onClick={() => navigate("/agent/tickets/CLOSED")}
            />
          </div>
        )}

        {/* 🔹 PRIORITY */}
        <div style={{ marginBottom: "25px" }}>
          <h4 className="text-format">🔥 Priority Tickets</h4>

          {priorityTickets.length === 0 ? (
            <p style={{ color: "gray" }}>No urgent tickets</p>
          ) : (
            priorityTickets.map((t) => (
              <div
                key={t.id}
                onClick={() =>
                  navigate(`/tickets/${t.id}`, { state: t })
                }
                style={{
                  padding: "12px",
                  marginBottom: "10px",
                  borderLeft:
                    t.priority === "URGENT"
                      ? "5px solid red"
                      : "5px solid orange",
                  background: "#fff3f3",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                <b>{t.title}</b>
                <div style={{ fontSize: "12px", color: "gray" }}>
                  {t.priority} • {t.status}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🔹 TABLE */}
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
                <td colSpan="5">Loading tickets...</td>
              </tr>
            ) : sortedTickets.length === 0 ? (
              <tr>
                <td colSpan="5">No assigned tickets</td>
              </tr>
            ) : (
              sortedTickets.map((t, index) => (
                <tr
                  key={t.id}
                  onClick={() =>
                    navigate(`/tickets/${t.id}`, { state: t })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>{t.title}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td>
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </ThemeTable>

      </div>
    </DashboardLayout>
  );
}

export default AgentDashboard;