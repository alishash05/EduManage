import React from "react";
import { Link } from "react-router-dom";

function TeacherDashboard() {
  return (
    <div className="dashboard-container">
      <h1>Teacher Dashboard</h1>
      <p>Manage your assigned classes and students.</p>

      <div className="dashboard-grid">
        <Link to="/attendance" className="dashboard-card">
          <h2>Attendance</h2>
          <p>Record attendance for assigned classes.</p>
        </Link>

        <Link to="/marks-results" className="dashboard-card">
          <h2>Marks & Results</h2>
          <p>Manage student marks and results.</p>
        </Link>

        <Link to="/profile" className="dashboard-card">
          <h2>My Profile</h2>
          <p>View your profile.</p>
        </Link>
      </div>
    </div>
  );
}

export default TeacherDashboard;
