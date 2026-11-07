
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRoles, children }) {
  let user = null;
  const token = localStorage.getItem("access_token");

  try {
    user = JSON.parse(localStorage.getItem("edumanage_user"));
  } catch {
    user = null;
  }

  // Check whether user is logged in
  if (!token || !user || !user.email || !user.role) {
    return <Navigate to="/" replace />;
  }

  // Check user role permission
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
