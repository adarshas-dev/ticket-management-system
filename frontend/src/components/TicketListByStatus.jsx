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
                  api
                    .put("/admin/tickets/auto-assign")
                    .then(() => {
                      toast.success("Tickets assigned successfully");
                      window.location.reload();
                    })
                    .catch(() => toast.error("Failed to assign tickets"));
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
              {tickets
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
      </div>
    </DashboardLayout>
  );
}

export default TicketListByStatus;
