
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(60);

  // 60-second countdown
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.verifyRegistrationOTP({
        email,
        otp,
      });

      localStorage.setItem(
        "edumanage_user",
        JSON.stringify(response.user)
      );

      // Verification is followed by a fresh login.
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      navigate("/", { replace: true });

    } catch (err) {
      setError(err.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0 || resending) return;

    setError("");
    setMessage("");
    setResending(true);

    try {
      const response = await api.resendRegistrationOTP({ email });

      setMessage(response.message || "A new OTP has been sent to your email.");
      setOtp("");
      setResendTimer(60);

    } catch (err) {
      setError(err.message || "Unable to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">E</div>
          <h1>EduManage</h1>
          <p className="login-subtitle">
            School Data Management System
          </p>
          <h2>Registration Email Not Found</h2>
          <p>Please register again to continue.</p>
          <Link to="/register">Go to Registration</Link>
          <p className="login-footer">
            © 2026 EduManage. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card otp-card">

        <div className="login-logo">E</div>

        <h1>EduManage</h1>

        <p className="login-subtitle">
          School Data Management System
        </p>

        <div className="otp-icon">
          <span>✉</span>
        </div>

        <h2 className="otp-heading">Verify Your Email</h2>

        <p className="otp-description">
          We've sent a 6-digit verification code to
        </p>

        <p className="otp-email">{email}</p>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {message && (
          <p className="success-message">{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="otp">
            Enter Verification Code
          </label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "").slice(0, 6)
              )
            }
            maxLength={6}
            autoComplete="one-time-code"
            required
          />

          <button
            className="login-button"
            type="submit"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="resend-section">
          <p>Didn't receive the verification code?</p>

          <button
            type="button"
            className="resend-button"
            onClick={handleResendOTP}
            disabled={resendTimer > 0 || resending}
          >
            {resending
              ? "Sending..."
              : resendTimer > 0
              ? `Resend OTP in ${resendTimer}s`
              : "Resend OTP"}
          </button>
        </div>

        <p className="otp-back">
          <Link to="/register">Back to Registration</Link>
        </p>

        <p className="login-footer">
          © 2026 EduManage. All rights reserved.
        </p>

      </div>
    </div>
  );
}

export default VerifyOTP;
