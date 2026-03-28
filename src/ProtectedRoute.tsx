import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../src/app/store";
import type React from "react";

const ProtectedRoute = ({ allowedRoles, children }: { 
  allowedRoles: string[], 
  children: React.ReactNode 
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  if (!user) return <Navigate to="/login" />;
  
  if (!allowedRoles.includes(user.role?.toLowerCase())) {
    // Redirect to their correct dashboard
    const role = user.role?.toLowerCase();
    if (role === "admin") return <Navigate to="/admin" />;
    if (role === "landlord") return <Navigate to="/landlord" />;
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;