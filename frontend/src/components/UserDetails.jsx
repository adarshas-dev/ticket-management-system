import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import StatCard from "../components/StatCard";
import { toast } from "react-toastify";
import ThemeTable from "./ThemeTable";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [ticketSearch, setTicketSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);

    Promise.all([
      api.get(`/admin/users/${id}`),
      api.get(`/admin/users/${id}/stats`),
    ])
      .then(([userRes, statsRes]) => {
        setUser(userRes.data);
        setStats(statsRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  //fetch user tickets
  useEffect(() => {
    if (user?.role === "USER") {
      api
        .get(`/admin/users/${id}/tickets`)
        .then((res) => setUserTickets(res.data))
        .catch(() => console.log("No tickets"));
    }
  }, [id, user]);

  useEffect(() => {
    api
      .get(`/reports/agent/${id}`)
      .then((res) => setReports(res.data))
      .catch(() => console.log("No reports found"));
  }, [id]);

  const toggleStatus = async () => {
    try {
      let autoAssign = false;

      if (user?.active) {
        const confirmAction = window.confirm(
          "This user has active tickets.\n\nAuto-assign them to other agents?",
        );

        if (!confirmAction) return;

        autoAssign = true;
      }

      const res = await api.put(`/admin/users/${id}/toggle-status`, {
        autoAssign,
      });

      setUser(res.data);

      toast.success(user?.active ? "User suspended" : "User activated");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Something went wrong";

      toast.info(message);
    }
  };

  const filteredTickets = userTickets
    .filter((t) => {
      const q = ticketSearch.toLowerCase();

      return (
        t.title?.toLowerCase().includes(q) &&
        (statusFilter ? t.status === statusFilter : true)
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "25px" }}>
          <h2 className="text-format">
            {user?.name || (
              <div className="text-center">
                <div className="spinner-border text-primary"></div>
              </div>
            )}
          </h2>

          <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
            <button
              className={`btn ${user?.active ? "btn-warning" : "btn-success"}`}
              onClick={toggleStatus}
            >
              {user?.active ? "Suspend" : "Activate"}
            </button>

            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                backgroundColor: "#d1e7dd",
                color: "black",
                fontWeight: "bold",
              }}
            >
              {user?.role || "Loading"}
            </span>

            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                backgroundColor: "#d1e7dd",
                color: "black",
              }}
            >
              <b>Email : </b>
              <a
                href={`https://mail.google.com/mail/?view=cm&to=${user?.email}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#0d6efd",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                {user?.email}
              </a>
            </span>

            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                backgroundColor: "#d1e7dd",
                color: "black",
              }}
            >
              <b>User ID : </b>
              {user?.id || "..."}
            </span>

            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                backgroundColor: user?.active ? "#198754" : "#dc3545",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {user?.active ? "Active" : "Suspended"}
            </span>
          </div>
        </div>

        {/* STATS */}
        {user && stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            {user.role === "USER" && (
              <StatCard
                title="Tickets Created"
                value={
                  (stats.open || 0) +
                  (stats.inProgress || 0) +
                  (stats.resolved || 0) +
                  (stats.closed || 0)
                }
                color="#0d6efd"
              />
            )}

            {(user.role === "USER" || user.role === "AGENT") && (
              <>
                <div
                  onClick={() => setStatusFilter("OPEN")}
                  style={{ cursor: "pointer" }}
                >
                  <StatCard title="Open" value={stats.open} color="#fd7e14" />
                </div>

                <div
                  onClick={() => setStatusFilter("IN_PROGRESS")}
                  style={{ cursor: "pointer" }}
                >
                  <StatCard
                    title="In Progress"
                    value={stats.inProgress}
                    color="#ffc107"
                  />
                </div>

                <div
                  onClick={() => setStatusFilter("RESOLVED")}
                  style={{ cursor: "pointer" }}
                >
                  <StatCard
                    title="Resolved"
                    value={stats.resolved}
                    color="#198754"
                  />
                </div>

                <div
                  onClick={() => setStatusFilter("CLOSED")}
                  style={{ cursor: "pointer" }}
                >
                  <StatCard
                    title="Closed"
                    value={stats.closed}
                    color="#6c757d"
                  />
                </div>
              </>
            )}

            {user.role === "ADMIN" && (
              <div style={{ padding: "20px", opacity: 0.8 }}>
                <h5 className="text-format">System Administrator</h5>
                <p style={{ color: "gray" }}>
                  This user has full access to manage users, tickets, and
                  reports.
                </p>
              </div>
            )}
          </div>
        )}

        {/* mini dashboard */}
        {user?.role === "USER" && (
          <div style={{ marginTop: "30px" }}>
            <h4 className="text-format">📋 Recent Tickets</h4>

            {statusFilter && (
              <div style={{ marginBottom: "10px", color: "#0d6efd" }}>
                Showing: <b>{statusFilter.replace("_", " ")}</b>
                <span
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                    color: "red",
                  }}
                  onClick={() => setStatusFilter("")}
                >
                  (clear)
                </span>
              </div>
            )}

            {/*SEARCH + FILTER */}
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
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
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
            </div>

            {/* TABLE */}
            {filteredTickets.length === 0 ? (
              <p style={{ color: "gray" }}>
                No tickets found. Try changing filters or search.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <ThemeTable>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTickets.slice(0, 5).map((t) => (
                      <tr
                        key={t.id}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/tickets/${t.id}`, { state: t })
                        }
                      >
                        <td>{t.id}</td>
                        <td>{t.title}</td>
                        <td>{t.status}</td>
                        <td>{t.priority}</td>
                        <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </ThemeTable>
              </div>
            )}
          </div>
        )}

        {/* REPORTS */}
        <div style={{ marginTop: "40px" }}>
          <h4 style={{ marginBottom: "15px" }} className="text-format">
            🚩 Reports Against This User
          </h4>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : reports.length === 0 ? (
            <p style={{ color: "gray" }}>No reports for this agent</p>
          ) : (
            reports.map((r) => (
              <div
                key={r.id}
                className="report-card"
                onClick={() => navigate(`/tickets/${r.ticketId}`, { state: r })}
              >
                <div style={{ fontWeight: "bold" }} className="text-format">
                  {r.reportedByName}
                </div>

                <div style={{ fontSize: "13px", color: "gray" }}>
                  Ticket #{r.ticketId} •{" "}
                  {new Date(r.createdAt).toLocaleString()}
                </div>

                <div style={{ marginTop: "5px" }} className="text-format">
                  {r.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserDetails;
