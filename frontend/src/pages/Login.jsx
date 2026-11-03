import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Temporary demo login.
    // Replace this with FastAPI authentication later.
    const demoAccounts = [
      {
        username: "principal",
        password: "Admin@123",
        role: "principal",
      },
      {
        username: "teacher",
        password: "Teacher@123",
        role: "teacher",
      },
      {
        username: "student",
        password: "Student@123",
        role: "student",
      },
    ];

    const account = demoAccounts.find(
      (user) =>
        user.username === username.trim() &&
        user.password === password
    );

    if (!account) {
      setError("Invalid username or password.");
      return;
    }

    // Demo only: localStorage is not secure authentication.
    localStorage.setItem(
      "edumanage_user",
      JSON.stringify({
        username: account.username,
        role: account.role,
      })
    );

    if (account.role === "principal") {
      navigate("/principal-dashboard");
    } else if (account.role === "teacher") {
      navigate("/teacher-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">E</div>

        <h1>EduManage</h1>
        <p className="login-subtitle">
          School Data Management System
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button className="login-button" type="submit">
            Sign In
          </button>
        </form>

       

        <p className="login-footer">
          © 2026 EduManage. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
