
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.loginUser({
        email: email.trim(),
        password: password,
      });

      // Store authentication tokens
      localStorage.setItem("access_token", response.access_token);

      if (response.refresh_token) {
        localStorage.setItem("refresh_token", response.refresh_token);
      }

      // Store logged-in user details
      localStorage.setItem(
        "edumanage_user",
        JSON.stringify(response.user)
      );

      // Navigate according to user role
      if (response.user.role === "principal") {
        navigate("/principal-dashboard");
      } else if (response.user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (response.user.role === "student") {
        navigate("/student-dashboard");
      } else {
        setError("Invalid user role.");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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

          {error && (
            <p className="error-message">{error}</p>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>

        <p className="login-footer">
          © 2026 EduManage. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
