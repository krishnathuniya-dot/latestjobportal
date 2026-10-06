import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUser,
  FiHome,
  FiArrowRight,
} from "react-icons/fi";
import "../css/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [formDataRrr, setFormDataRrr] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // =========================================
  // HANDLE INPUT
  // =========================================
  const handleChangeRrr = (e) => {
    setFormDataRrr({
      ...formDataRrr,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  // =========================================
  // LOGIN
  // =========================================
  const handleSubmitRrr = async (e) => {
    e.preventDefault();

    if (!formDataRrr.email || !formDataRrr.password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "https://latestjobportal.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataRrr),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch (error) {
        console.error("Invalid server response:", error);
        data = {};
      }

      console.log("Login Response:", data);

      // =========================================
      // LOGIN SUCCESS
      // =========================================
      if (response.ok && data.success) {
        const loggedInUser =
          data.user ||
          data.data?.user ||
          data.data ||
          null;

        if (!loggedInUser) {
          setMessage(
            "Login successful, but user information was not received."
          );
          return;
        }

        console.log(
          "Logged In User:",
          loggedInUser
        );

        // =========================================
        // IMPORTANT:
        // Save BOTH keys for compatibility
        // =========================================

        localStorage.setItem(
          "User",
          JSON.stringify(loggedInUser)
        );

        localStorage.setItem(
          "user",
          JSON.stringify(loggedInUser)
        );

        console.log(
          "User =>",
          JSON.parse(
            localStorage.getItem("User")
          )
        );

        console.log(
          "user =>",
          JSON.parse(
            localStorage.getItem("user")
          )
        );

        setMessage(
          data.message ||
            "Login successful!"
        );

        // Clear password field
        setFormDataRrr({
          email: "",
          password: "",
        });

        // =========================================
        // REDIRECT
        // =========================================
        setTimeout(() => {
          navigate("/search");
        }, 800);
      } else {
        setMessage(
          data.message ||
            "Invalid email or password."
        );
      }
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
    <div className="login-body-rrr">

      {/* ================= HEADER ================= */}

      <div className="login-top-banner-rrr">

        <div className="login-header-content-rrr">

          <div className="login-logo-rrr">
            <span>JOB</span> PORTAL
          </div>

          <h1>
            Login To Your Account
          </h1>

          <p>
            Access your account and continue
            your job journey
          </p>

        </div>

      </div>

      {/* ================= LOGIN CONTAINER ================= */}

      <div className="login-container-rrr">

        {/* Back Home */}

        <Link
          to="/"
          className="login-back-link-rrr"
        >
          <FiHome />
          Back To Home
        </Link>

        {/* Profile Icon */}

        <div className="login-profile-icon-rrr">
          <FiUser />
        </div>

        {/* Title */}

        <div className="login-welcome-rrr">

          <h2>
            Welcome Back!
          </h2>

          <p>
            Sign in to access your account
          </p>

        </div>

        {/* Message */}

        {message && (
          <div
            className={`login-message-rrr ${
              message
                .toLowerCase()
                .includes("success")
                ? "login-success-rrr"
                : "login-error-rrr"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}

        <form
          className="login-form-rrr"
          onSubmit={handleSubmitRrr}
        >

          {/* Email */}

          <div className="login-input-group-rrr">

            <FiMail
              className="login-input-icon-rrr"
            />

            <input
              className="login-input-rrr"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formDataRrr.email}
              onChange={handleChangeRrr}
              autoComplete="email"
              required
            />

          </div>

          {/* Password */}

          <div className="login-input-group-rrr">

            <FiLock
              className="login-input-icon-rrr"
            />

            <input
              className="login-input-rrr login-password-input-rrr"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Enter your password"
              value={formDataRrr.password}
              onChange={handleChangeRrr}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="login-show-password-rrr"
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

          {/* Forgot */}

          <div className="login-forgot-row-rrr">

            <Link
              to="/forgotpassword"
              className="login-forgot-link-rrr"
            >
              Forgot your Password?
            </Link>

          </div>

          {/* Login Button */}

          <button
            className="login-button-rrr"
            type="submit"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="login-loader-rrr"></span>
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

        <div className="login-or-box-rrr">
          <span>OR</span>
        </div>

        {/* Signup */}

        <div className="login-signup-rrr">

          <p>
            You Don't have an Account?
          </p>

          <Link
            to="/register"
            className="login-signup-link-rrr"
          >
            SIGN UP NOW
          </Link>

        </div>

      </div>

      {/* Footer */}

      <div className="login-footer-rrr">
        © {new Date().getFullYear()} Job Portal.
        All Rights Reserved.
      </div>

    </div>
  );
}