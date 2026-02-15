import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: isActive ? "underline" : "none",
    textUnderlineOffset: "6px",
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        // background: "linear-gradient(to left, #d30d7a, #8b064d, #510229)",
        background: `linear-gradient(to right, #510229 0%, #510229 25%, #8b064d 60%, #d30d7a 100%)`,
        zIndex: 1000,
      }}
    >
      {/* LEFT SIDE TITLE */}
      <div
        style={{
          fontWeight: "bold",
          fontSize: "18px",
          color: "white",
          letterSpacing: "1px",
        }}
      >
        TICKET SYSTEM
      </div>

      {/* RIGHT SIDE NAV ITEMS */}
      <div className="d-flex align-items-center gap-4">
        {role === "USER" && (
          <>
            <NavLink
              to="/"
              style={navLinkStyle}
              className="text-white fw-semibold"
            >
              My Tickets
            </NavLink>

            <NavLink
              to="/create"
              style={navLinkStyle}
              className="text-white fw-semibold"
            >
              Create Ticket
            </NavLink>
          </>
        )}

        {role === "AGENT" && (
          <NavLink
            to="/"
            style={navLinkStyle}
            className="text-white fw-semibold"
          >
            Assigned Tickets
          </NavLink>
        )}

        {role === "ADMIN" && (
          <NavLink
            to="/"
            style={navLinkStyle}
            className="text-white fw-semibold"
          >
            Dashboard
          </NavLink>
        )}

        <button
          onClick={handleLogout}
          className="btn btn-sm btn-warning fw-semibold"
        >
          <i className="fa-solid fa-unlock-keyhole me-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;