import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRoles, children }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("edumanage_user"));
  } catch {
    user = null;
  }

  if (!user || !user.username || !user.role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
