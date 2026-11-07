
import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.verifyRegistrationOTP({
        email,
        otp,
      });

      // Save user information and tokens
      localStorage.setItem(
        "edumanage_user",
        JSON.stringify(response.user)
      );

      localStorage.setItem(
        "access_token",
        response.access_token
      );

      localStorage.setItem(
        "refresh_token",
        response.refresh_token
      );

      // Navigate to login after successful registration
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Registration email not found</h2>
          <p>Please register again.</p>
          <Link to="/register">Go to Registration</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>EduManage</h1>
        <h2>Verify Your Email</h2>

        <p>Enter the 6-digit OTP for:</p>
        <strong>{email}</strong>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            required
          />

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p>
          <Link to="/register">Back to Registration</Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyOTP;
