import { isLoggedIn } from "../utils/jwt";
import { Navigate } from "react-router-dom";

function ProtectedRoute({children}){
    if(!isLoggedIn()){
        return <Navigate to="/login" />
    }
    return children;
}
export default ProtectedRoute;