
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiArrowRight, FiHome } from "react-icons/fi";
import "../css/seekerlogin.css";

const Seekerrlogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "https://latestjobportal.onrender.com/api/loginn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      console.log("Login Response:", result);

      if (response.ok) {
        setMessage(result.message || "Login successful!");

        // Save complete user
        if (result.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(result.user)
          );

          // Candidate ID
          if (result.user._id) {
            localStorage.setItem(
              "candidateId",
              result.user._id
            );
          }

          // Candidate Name
          if (result.user.fullName) {
            localStorage.setItem(
              "candidateName",
              result.user.fullName
            );
          }

          console.log(
            "Candidate ID Saved:",
            result.user._id
          );

          console.log(
            "Candidate Name Saved:",
            result.user.fullName
          );
        }

        setTimeout(() => {
          navigate("/home");
        }, 800);
      } else {
        setMessage(
          result.message || "Invalid email or password."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seeker-login-page">

      {/* Header */}
      <div className="login-header">
        <div className="login-header-content">
          <div className="login-logo">
            <span>JOB</span> PORTAL
          </div>

          <p>Find your dream job and build your career</p>
        </div>
      </div>

      {/* Main */}
      <div className="login-container">

        <div className="login-card">

          {/* Icon */}
          <div className="profile-icon">
            <FiUser />
          </div>

          <div className="login-title">
            <h2>Welcome Back!</h2>
            <p>Login to continue to your account</p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`message ${
                message.toLowerCase().includes("success")
                  ? "success-message"
                  : "error-message"
              }`}
            >
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="input-group">
              <FiMail className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <FiLock className="input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Forgot */}
            <div className="forgot-row">
              <Link
                to="/forgot-password"
                className="forgot-link"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loader"></span>
                  SIGNING IN...
                </>
              ) : (
                <>
                  SIGN IN
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* Signup */}
          <div className="signup-section">
            <p>
              Don't have an account?
            </p>

            <Link
              to="/seeker"
              className="signup-btn"
            >
              CREATE NEW ACCOUNT
            </Link>
          </div>

          {/* Home */}
          <button
            className="back-home"
            onClick={() => navigate("/")}
          >
            <FiHome />
            Back to Home
          </button>

        </div>
      </div>

      {/* Footer */}
      <div className="login-footer">
        © {new Date().getFullYear()} Job Portal. All Rights Reserved.
      </div>

    </div>
  );
};

export default Seekerrlogin;

