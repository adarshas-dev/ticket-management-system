import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
    const token = localStorage.getItem("token");
    if(!token) return null;
    
    const decoded = jwtDecode(token);
    return decoded.role;
};

export const isLoggedIn = () => {
    return !!localStorage.getItem("token");
};