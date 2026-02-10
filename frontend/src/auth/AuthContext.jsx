import { createContext, useContext, useState } from "react";
import { getUserRole } from "../utils/jwt";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(getUserRole());

  const loginSuccess = () => {
    setRole(getUserRole()); // re-read role AFTER token is stored
  };

  const logout = () => {
    localStorage.removeItem("token");
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);