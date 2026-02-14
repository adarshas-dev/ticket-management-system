import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { role, logout } = useAuth();

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: isActive ? "underline" : "none",
    textUnderlineOffset: "6px",
  });

  return (
    <div
      className="d-flex justify-content-end px-4 py-2"
      style={{
        background: "linear-gradient(to left, #d30d7a, #8b064d, #510229)"
        // background: "#cb257f"
      }}
    >
      <div className="d-flex align-items-center gap-4">

        {role === "USER" && (
          <NavLink
            to="/"
            style={navLinkStyle}
            className="text-white fw-bold nav-item-custom"
          >
            My Tickets
          </NavLink>
        )}

        {role === "USER" && (
          <NavLink
            to="/create"
            style={navLinkStyle}
            className="text-white fw-bold nav-item-custom"
          >
            Create Ticket
          </NavLink>
        )}

        {role === "AGENT" && (
          <NavLink
            to="/"
            style={navLinkStyle}
            className="text-white fw-bold nav-item-custom"
          >
            Assigned Tickets
          </NavLink>
        )}

        {role === "ADMIN" && (
          <NavLink
            to="/"
            style={navLinkStyle}
            className="text-white fw-bold nav-item-custom"
          >
            Dashboard
          </NavLink>
        )}

        <button
          onClick={logout}
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