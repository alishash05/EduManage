import React from "react";
import { Link } from "react-router-dom";

function PrincipalDashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Principal Dashboard</h1>
          <p>Welcome to EduManage</p>
        </div>
      </header>

      <div className="dashboard-grid">
        <Link to="/manage-teachers" className="dashboard-card">
          <h2>Teachers</h2>
          <p>Add and manage teacher records.</p>
        </Link>

        <Link to="/manage-students" className="dashboard-card">
          <h2>Students</h2>
          <p>Add and manage student records.</p>
        </Link>

        <Link to="/manage-classes" className="dashboard-card">
          <h2>Classes</h2>
          <p>Manage classes and sections.</p>
        </Link>

        <Link to="/attendance" className="dashboard-card">
          <h2>Attendance</h2>
          <p>Review school attendance.</p>
        </Link>

        <Link to="/marks-results" className="dashboard-card">
          <h2>Marks & Results</h2>
          <p>Review academic performance.</p>
        </Link>
      </div>
    </div>
  );
}

export default PrincipalDashboard;
