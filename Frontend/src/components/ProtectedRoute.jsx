import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../utils/auth";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/staff-login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
