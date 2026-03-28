import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

function Navbar() {
  const [isHover, setIsHover] = useState(false);
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinkStyle = ({ isActive }) =>
    isActive
      ? {
          background: "rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
        }
      : {};

  // const logoutLogo = ({isActive}) =>
  //   isActive?{
  //     <i></i>
  //   }:{};

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
              className="text-white fw-semibold nav-item-custom"
            >
              My Tickets
            </NavLink>
          </>
        )}

        {role === "AGENT" && (
          <NavLink
            to="/"
            style={navLinkStyle}
            className="text-white fw-semibold nav-item-custom"
          >
            Assigned Tickets
          </NavLink>
        )}

        {role === "ADMIN" && (
          <NavLink
            to="/"
            style={navLinkStyle}
            className="text-white fw-semibold nav-item-custom"
          >
            Dashboard
          </NavLink>
        )}

        <button
          onClick={handleLogout}
          className="btn btn-sm btn-warning fw-semibold"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <i
            className={`me-2 fa-solid ${
              isHover ? "fa-unlock" : "fa-lock"
            }`}
          ></i>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
