import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import { Table } from "react-bootstrap";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { toast } from "react-toastify";
import ThemeTable from "./ThemeTable";

function TicketListByStatus() {
  const { status } = useParams();
  const { role } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);

    let endpoint = "";

    if (role === "ADMIN") {
      endpoint = `/tickets/status/${status}`;
    } else if (role === "AGENT") {
      endpoint = `/tickets/assigned/status/${status}`;
    } else if (role === "USER") {
      if (status === "ALL") {
        endpoint = `/tickets/my`;
      } else {
        endpoint = `/tickets/my/status/${status}`;
      }
    }

    api
      .get(endpoint)
      .then((res) => setTickets(res.data))
      .catch((err) => {
        setError(
          err.response?.status === 403
            ? "Not authorized"
            : "Failed to load tickets",
        );
      })
      .finally(() => setLoading(false));
  }, [status, role]);

  const filteredTickets = [...tickets].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const totalPages = Math.ceil(filteredTickets.length / pageSize);
  const paginatedTickets = filteredTickets.slice(
    page * pageSize,
    page * pageSize + pageSize,
  );

  return (
    <DashboardLayout>
      <div className="titcket-list-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            gap: "10px",
          }}
        >
          <h2 style={{ margin: 0 }} className="text-format">
            {status} Tickets
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: "300px" }}
            />

            {role === "ADMIN" && status === "OPEN" && (
              <button
                className="btn btn-primary fw-bold shadow-sm"
                onClick={() => {
                  api.put("/admin/tickets/auto-assign").then((res) => {
                    if (res.data === "No tickets to assign") {
                      toast.info("No tickets to assign");
                    } else {
                      toast.success("Tickets assigned successfully");

                      setTimeout(() => {
                        window.location.reload();
                      }, 1500);
                    }
                  });
                }}
              >
                ⚡ Auto Assign
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary"></div>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && tickets.length === 0 && (
          <p className="text-format">No tickets found</p>
        )}

        {!loading && !error && tickets.length > 0 && (
          <ThemeTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets
                .filter((t) => {
                  const q = search.toLowerCase();

                  return (
                    t.title?.toLowerCase().includes(q) ||
                    t.status?.toLowerCase().includes(q) ||
                    t.priority?.toLowerCase().includes(q)
                  );
                })
                .map((t, index) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/tickets/${t.id}`)}
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
                  </tr>
                ))}
            </tbody>
          </ThemeTable>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="pagination d-flex justify-content-center align-items-center mt-3">
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

export default TicketListByStatus;
