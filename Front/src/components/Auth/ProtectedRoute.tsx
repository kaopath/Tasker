import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = () => {
    const { userToken } = useAuth();
  
    if (!userToken) {
      return <Navigate to="/login" />;
    }
    
    return <Outlet />;
  };