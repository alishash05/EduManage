import React from "react";
import { Link } from "react-router-dom";

function StudentDashboard() {
  return (
    <div className="dashboard-container">
      <h1>Student Dashboard</h1>
      <p>Welcome to your academic dashboard.</p>

      <div className="dashboard-grid">
        <Link to="/attendance" className="dashboard-card">
          <h2>My Attendance</h2>
          <p>View your attendance records.</p>
        </Link>

        <Link to="/marks-results" className="dashboard-card">
          <h2>My Results</h2>
          <p>View your marks and results.</p>
        </Link>

        <Link to="/profile" className="dashboard-card">
          <h2>My Profile</h2>
          <p>View your student information.</p>
        </Link>
      </div>
    </div>
  );
}

export default StudentDashboard;
