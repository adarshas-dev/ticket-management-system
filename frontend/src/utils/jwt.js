import { jwtDecode } from "jwt-decode";

const getDecodedToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const getUserRole = () => {
  const decoded = getDecodedToken();
  return decoded?.role || null;
};

export const getUserName = () => {
  const decoded = getDecodedToken();
  return decoded?.name || null;
};

export const getUserEmail = () => {
  const decoded = getDecodedToken();
  return decoded?.sub || null; 
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};