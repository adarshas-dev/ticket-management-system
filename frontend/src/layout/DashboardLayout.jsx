import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axios";

function DashboardLayout({ children }) {
  const [stats, setStats] = useState(null);
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "ADMIN") {
      api.get("/dashboard/stats").then((res) => setStats(res.data));
    }

    if (role === "AGENT") {
      api.get("/dashboard/agent-stats").then((res) => setStats(res.data));
    }
  }, [role]);

  return (
    <div
      className="d-flex min-vh-100 text-white"
      style={{
        background: "linear-gradient(135deg, #d30d7a, #8b064d, #510229)",
      }}
    >
      {/* Sidebar */}
      <div
        className="d-flex flex-column justify-content-between p-4"
        style={{
          width: "260px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div>
          <h4 className="fw-bold mb-4">TICKET SYSTEM</h4>

          {role === "USER" && (
            <Link to="/create" className="btn btn-light w-100 mb-4">
              <i className="fa-solid fa-plus me-2"></i>
              Create Ticket
            </Link>
          )}

          {role === "ADMIN" && (
            <Link to="/create-user" className="btn btn-light w-100 mb-4">
              <i className="fa-solid fa-plus me-2"></i>
              New User
            </Link>
          )}

          {role === "ADMIN" && (
            <Link to="/create" className="btn btn-light w-100 mb-4">
              <i className="fa-solid fa-users me-2"></i>
              Manage User
            </Link>
          )}

          {role === "ADMIN" && stats && (
            <div className="d-flex flex-column gap-3">
              <SidebarItem
                label="Open"
                count={stats.openTickets}
                onClick={() => navigate("/admin/tickets/OPEN")}
              />

              <SidebarItem
                label="In Progress"
                count={stats.inProgressTickets}
                onClick={() => navigate("/admin/tickets/IN_PROGRESS")}
              />

              <SidebarItem
                label="Resolved"
                count={stats.resolvedTickets}
                onClick={() => navigate("/admin/tickets/RESOLVED")}
              />

              <SidebarItem
                label="Closed"
                count={stats.closedTickets}
                onClick={() => navigate("/admin/tickets/CLOSED")}
              />
            </div>
          )}
          {role === "AGENT" && stats && (
            <div className="d-flex flex-column gap-3">
              <SidebarItem
                label="Open"
                count={stats.openTickets}
                onClick={() => navigate("/agent/tickets/OPEN")}
              />

              <SidebarItem
                label="In Progress"
                count={stats.inProgressTickets}
                onClick={() => navigate("/agent/tickets/IN_PROGRESS")}
              />

              <SidebarItem
                label="Resolved"
                count={stats.resolvedTickets}
                onClick={() => navigate("/agent/tickets/RESOLVED")}
              />

              <SidebarItem
                label="Closed"
                count={stats.closedTickets}
                onClick={() => navigate("/agent/tickets/CLOSED")}
              />
            </div>
          )}
        </div>

        {/* want to add profile here */}
        <button className="btn btn-outline-light">Logout</button>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 bg-white text-dark p-5"
        style={{
          borderTopLeftRadius: "1rem",
          borderBottomLeftRadius: "1rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SidebarItem({ label, count, onClick }) {
  return (
    <div
      onClick={onClick}
      className="d-flex justify-content-between align-items-center p-3 rounded"
      style={{
        background: "rgba(255,255,255,0.15)",
      }}
    >
      <span>{label}</span>
      <span className="fw-bold">{count}</span>
    </div>
  );
}

export default DashboardLayout;
