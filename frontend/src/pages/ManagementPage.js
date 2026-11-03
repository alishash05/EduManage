import React from "react";

function ManagementPage({ title, description }) {
  return (
    <div className="dashboard-container">
      <div className="page-heading">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="management-panel">
        <h2>{title}</h2>
        <p>
          This module is ready for implementation.
          Connect it to the FastAPI backend to manage records.
        </p>
      </div>
    </div>
  );
}

export default ManagementPage;