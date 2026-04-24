import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import ThemeTable from "./ThemeTable";
import StatCard from "./StatCard";

function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const navigate = useNavigate();

  // FETCH DATA
  useEffect(() => {
    api
      .get("/tickets/my")
      .then((res) => {
        setTickets(res.data || []);
      })
      .catch((err) => {
        setError(
          err.response?.status === 403
            ? "Failed to load data"
            : "Failed to load tickets",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // STATS
  useEffect(() => {
    api.get("/dashboard/customer-stats").then((res) => setStats(res.data));
  }, []);

  // FILTER + SEARCH
  useEffect(() => {
    const filtered = [...tickets]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 🔥 NEW
  .filter((t) => {
    const q = (search || "").toLowerCase();

    return (
      (t.title || "").toLowerCase().includes(q) ||
      (t.status || "").replace("_", " ").toLowerCase().includes(q) ||
      (t.priority || "").toLowerCase().includes(q)
    );
  });

    setFilteredTickets(filtered);
    setPage(0); // reset page on search
  }, [search, tickets]);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredTickets.length / pageSize);

  const paginatedTickets = filteredTickets.slice(
    page * pageSize,
    page * pageSize + pageSize,
  );

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <DashboardLayout>
      <div>
        {/* CARDS */}
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

        {/* HEADER */}
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

        {/* TABLE */}
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
            ) : paginatedTickets.length === 0 ? (
              <tr>
                <td colSpan="5">No tickets found</td>
              </tr>
            ) : (
              paginatedTickets.map((t, index) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`, { state: t })}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
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

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div
            className="pagination d-flex justify-content-center align-items-center mt-3"
            
          >
            {/* Prev */}
            <button
              className="btn"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              style={{
                backgroundColor: page === 0 ? "#444" : "#0d6efd",
                color: "white",
                border: "none",
                padding: "4px 10px",
                fontSize: "13px",
                borderRadius: "6px",
                cursor: page === 0 ? "not-allowed" : "pointer",
              }}
            >
              ⬅Prev
            </button>

            {/* Page Info */}
            <span
              className="text-format"
              style={{
                fontSize: "13px",
                minWidth: "80px",
                textAlign: "center",
              }}
            >
              {page + 1} / {totalPages}
            </span>

            {/* Next */}
            <button
              className="btn"
              disabled={page === totalPages - 1}
              onClick={() => setPage(page + 1)}
              style={{
                backgroundColor: page === totalPages - 1 ? "#444" : "#0d6efd",
                color: "white",
                border: "none",
                padding: "4px 10px",
                fontSize: "13px",
                borderRadius: "6px",
                cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
              }}
            >
              Next➡
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default UserDashboard;
