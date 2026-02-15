import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axios";

function DashboardLayout({ children }) {
  const [stats, setStats] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const { role, name } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "ADMIN") {
      api.get("/dashboard/stats").then((res) => setStats(res.data));
    }

    if (role === "AGENT") {
      api.get("/dashboard/agent-stats").then((res) => setStats(res.data));
    }
  }, [role]);

  const sidebarWidth = collapsed ? "80px" : "260px";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: sidebarWidth,
          transition: "0.3s ease",
          // background: "linear-gradient(135deg, #d30d7a, #8b064d, #510229)",
          background: `linear-gradient(to bottom, #510229 0%, #510229 25%, #8b064d 60%, #d30d7a 100%)`,
          color: "white",
          padding: "20px 10px",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          height: "100vh",
          overflowY: "auto",
          paddingTop: "70px",
        }}
      >
        <div>
          {/* Toggle Button */}
          <div
            style={{
              display: "flex",
              justifyContent: collapsed ? "center" : "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            {!collapsed && <h5 style={{ margin: 10 }}>MENU</h5>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              <i
                className={`fa-solid ${collapsed ? "fa-bars" : "fa-angle-left"}`}
              ></i>
            </button>
          </div>

          {/* USER BUTTON */}
          {role === "USER" && (
            <SidebarLink
              to="/create"
              icon="fa-plus"
              label="Create Ticket"
              collapsed={collapsed}
            />
          )}

          {role === "ADMIN" && (
            <>
              <SidebarLink
                to="/create-user"
                icon="fa-user-plus"
                label="New User"
                collapsed={collapsed}
              />
              <SidebarLink
                to="/admin/users"
                icon="fa-users"
                label="Manage Users"
                collapsed={collapsed}
              />
            </>
          )}

          {/* ADMIN STATS */}
          {role === "ADMIN" && stats && (
            <SidebarSection
              stats={stats}
              navigate={navigate}
              collapsed={collapsed}
              basePath="/admin/tickets"
            />
          )}

          {/* AGENT STATS */}
          {role === "AGENT" && stats && (
            <SidebarSection
              stats={stats}
              navigate={navigate}
              collapsed={collapsed}
              basePath="/agent/tickets"
            />
          )}
        </div>

        {/* PROFILE */}
        <div
          style={{
            padding: "15px",
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <button
            onClick={() => navigate("/profile")}
            className="sidebar-section"
            style={{
              border: "none",
              color: "white",
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: "10px",
            }}
          >
            <i className="fa-solid fa-user"></i>
            {!collapsed && <span>{name}</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          marginLeft: sidebarWidth,
          transition: "0.3s ease",
          flex: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#f8f9fa",
        }}
      >
        <div
          style={{
            height: "70px",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            padding: "0 30px",
            marginTop: "70px",
            borderBottom: "1px solid #ddd",
          }}
        >
          {role === "ADMIN" && <h5 style={{ margin: 0 }}>Admin Dashboard</h5>}
          {role === "AGENT" && <h5 style={{ margin: 0 }}>Agent Dashboard</h5>}
          {role === "USER" && <h5 style={{ margin: 0 }}>User Dashboard</h5>}
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "30px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* Sidebar link component */
function SidebarLink({ to, icon, label, collapsed }) {
  return (
    <Link
      to={to}
      className="sidebar-link"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        borderRadius: "6px",
        color: "white",
        textDecoration: "none",
        marginBottom: "10px",
      }}
    >
      <i className={`fa-solid ${icon}`}></i>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

/* Sidebar section for stats */
function SidebarSection({ stats, navigate, collapsed, basePath }) {
  const items = [
    { label: "Open", value: stats.openTickets, status: "OPEN" },
    {
      label: "In Progress",
      value: stats.inProgressTickets,
      status: "IN_PROGRESS",
    },
    { label: "Resolved", value: stats.resolvedTickets, status: "RESOLVED" },
    { label: "Closed", value: stats.closedTickets, status: "CLOSED" },
  ];

  return (
    <div style={{ marginTop: "20px" }}>
      {items.map((item) => (
        <div
          className="sidebar-section"
          key={item.status}
          onClick={() => navigate(`${basePath}/${item.status}`)}
          style={{
            display: "flex",
            justifyContent: collapsed ? "center" : "space-between",
            alignItems: "center",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
        >
          {!collapsed && <span>{item.label}</span>}
          {!collapsed && <span>{item.value}</span>}
          {collapsed && <i className="fa-solid fa-circle-dot"></i>}
        </div>
      ))}
    </div>
  );
}

export default DashboardLayout;
