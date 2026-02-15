import { createContext, useContext, useState } from "react";
import { getUserRole, getUserName, getUserEmail } from "../utils/jwt";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(getUserRole());
  const [name, setName] = useState(getUserName());
  const [email, setEmail] = useState(getUserEmail());

  const loginSuccess = () => {
    setRole(getUserRole()); 
    setName(getUserName());
    setEmail(getUserEmail());
  };

  const logout = () => {
    localStorage.removeItem("token");
    setRole(null);
    setName(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ role, name, email, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
