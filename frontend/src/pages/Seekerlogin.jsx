import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiHome,
} from "react-icons/fi";
import "../css/seekerlogin.css";

const BASE_URL = "https://latestjobportal.onrender.com";

const Seekerrlogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ==========================================
  // INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  // ==========================================
  // LOGIN
  // ==========================================
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
        `${BASE_URL}/api/loginn`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      console.log("================================");
      console.log("SEEKER LOGIN RESPONSE");
      console.log("Status:", response.status);
      console.log("Response:", result);
      console.log("================================");

      if (!response.ok) {
        setMessage(
          result?.message ||
            "Invalid email or password."
        );

        return;
      }

      // ==========================================
      // GET USER FROM RESPONSE
      // ==========================================
      const loggedInUser =
        result?.user ||
        result?.data?.user ||
        result?.data ||
        null;

      console.log(
        "Logged In User:",
        loggedInUser
      );

      // ==========================================
      // CHECK USER
      // ==========================================
      if (!loggedInUser) {
        console.error(
          "User data not found in login response"
        );

        setMessage(
          "Login successful, but user information was not received."
        );

        return;
      }

      // ==========================================
      // GET CANDIDATE ID
      // ==========================================
      const candidateId =
        loggedInUser?._id ||
        loggedInUser?.id;

      console.log(
        "Candidate ID:",
        candidateId
      );

      // ==========================================
      // CANDIDATE ID REQUIRED
      // ==========================================
      if (!candidateId) {
        console.error(
          "Candidate ID missing from login response:",
          loggedInUser
        );

        setMessage(
          "Login successful, but candidate ID is missing."
        );

        return;
      }

      // ==========================================
      // SAVE COMPLETE USER
      // ==========================================
      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      // ==========================================
      // SAVE CANDIDATE ID
      // ==========================================
      localStorage.setItem(
        "candidateId",
        candidateId
      );

      // ==========================================
      // SAVE USER ID ALSO
      // ==========================================
      localStorage.setItem(
        "userId",
        candidateId
      );

      // ==========================================
      // SAVE CANDIDATE NAME
      // ==========================================
      if (loggedInUser?.fullName) {
        localStorage.setItem(
          "candidateName",
          loggedInUser.fullName
        );
      }

      // ==========================================
      // DEBUG LOCAL STORAGE
      // ==========================================
      console.log("================================");
      console.log("LOGIN SUCCESS");
      console.log(
        "Stored User:",
        localStorage.getItem("user")
      );
      console.log(
        "Stored Candidate ID:",
        localStorage.getItem("candidateId")
      );
      console.log(
        "Stored User ID:",
        localStorage.getItem("userId")
      );
      console.log("================================");

      setMessage(
        result?.message ||
          "Login successful!"
      );

      // ==========================================
      // GO HOME
      // ==========================================
      setTimeout(() => {
        navigate("/home");
      }, 800);

    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      setMessage(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seeker-login-page">

      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="login-header">
        <div className="login-header-content">

          <div className="login-logo">
            <span>JOB</span> PORTAL
          </div>

          <p>
            Find your dream job and build your career
          </p>

        </div>
      </div>

      {/* ==========================================
          MAIN
      ========================================== */}
      <div className="login-container">

        <div className="login-card">

          {/* PROFILE ICON */}
          <div className="profile-icon">
            <FiUser />
          </div>

          {/* TITLE */}
          <div className="login-title">
            <h2>
              Welcome Back!
            </h2>

            <p>
              Login to continue to your account
            </p>
          </div>

          {/* MESSAGE */}
          {message && (
            <div
              className={`message ${
                message
                  .toLowerCase()
                  .includes("success")
                  ? "success-message"
                  : "error-message"
              }`}
            >
              {message}
            </div>
          )}

          {/* ==========================================
              FORM
          ========================================== */}
          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
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

            {/* PASSWORD */}
            <div className="input-group">

              <FiLock className="input-icon" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
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
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

            {/* FORGOT PASSWORD */}
            <div className="forgot-row">

              <Link
                to="/forgot-password"
                className="forgot-link"
              >
                Forgot Password?
              </Link>

            </div>

            {/* SUBMIT */}
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

          {/* DIVIDER */}
          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* SIGNUP */}
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

          {/* BACK HOME */}
          <button
            className="back-home"
            onClick={() => navigate("/")}
          >
            <FiHome />
            Back to Home
          </button>

        </div>

      </div>

      {/* FOOTER */}
      <div className="login-footer">
        © {new Date().getFullYear()} Job Portal.
        All Rights Reserved.
      </div>

    </div>
  );
};

export default Seekerrlogin;