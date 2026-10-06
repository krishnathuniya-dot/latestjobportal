
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiBriefcase,
  FiTag,
  FiGlobe,
  FiFileText,
  FiUpload,
  FiArrowRight,
  FiHome,
} from "react-icons/fi";
import "../css/register.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    personName: "",
    email: "",
    password: "",
    companyName: "",
    tagline: "",
    description: "",
    website: "",
    logo: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const data = new FormData();

      data.append("personName", formData.personName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("companyName", formData.companyName);
      data.append("tagline", formData.tagline);
      data.append("description", formData.description);
      data.append("website", formData.website);

      if (formData.logo) {
        data.append("logo", formData.logo);
      }

      const response = await fetch(
        "https://latestjobportal.onrender.com/api/register",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      console.log("Register Response:", result);

      if (response.ok) {
        // Save complete user
        localStorage.setItem(
          "User",
          JSON.stringify(result.user)
        );

        console.log(
          "Saved User:",
          JSON.parse(localStorage.getItem("User"))
        );

        setMessage(
          result.message || "Registration successful!"
        );

        // Reset form
        setFormData({
          personName: "",
          email: "",
          password: "",
          companyName: "",
          tagline: "",
          description: "",
          website: "",
          logo: null,
        });

        // Reset file input
        const fileInput = document.querySelector(
          'input[name="logo"]'
        );

        if (fileInput) {
          fileInput.value = "";
        }

        // Login page
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setMessage(
          result.message || "Registration failed."
        );
      }
    } catch (error) {
      console.error("Registration Error:", error);

      setMessage(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      {/* ================= HEADER ================= */}

      <div className="signup-header">

        <div className="signup-header-inner">

          <div className="signup-logo">
            <span>JOB</span> PORTAL
          </div>

          <h1>Create Your Employer Account</h1>

          <p>
            Build your company profile and start hiring
            talented candidates
          </p>

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="signup-main">

        <div className="signup-card">

          {/* Back Home */}

          <Link
            to="/"
            className="signup-back-home"
          >
            <FiHome />
            Back To Home
          </Link>

          {/* Icon */}

          <div className="signup-profile-icon">
            <FiBriefcase />
          </div>

          {/* Title */}

          <div className="signup-title">

            <h2>Register Your Company</h2>

            <p>
              Enter your company details to get started
            </p>

          </div>

          {/* Message */}

          {message && (
            <div
              className={`signup-message ${
                message.toLowerCase().includes("success")
                  ? "signup-success"
                  : "signup-error"
              }`}
            >
              {message}
            </div>
          )}

          {/* ================= FORM ================= */}

          <form
            className="signup-form"
            onSubmit={handleSubmit}
          >

            <div className="form-grid">

              {/* Person Name */}

              <div className="form-group">

                <label>
                  Concern Person Name *
                </label>

                <div className="signup-input-wrapper">

                  <FiUser />

                  <input
                    type="text"
                    name="personName"
                    placeholder="Enter your name"
                    value={formData.personName}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* Email */}

              <div className="form-group">

                <label>
                  Your Email *
                </label>

                <div className="signup-input-wrapper">

                  <FiMail />

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

              </div>

              {/* Password */}

              <div className="form-group">

                <label>
                  Password *
                </label>

                <div className="signup-input-wrapper">

                  <FiLock />

                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />

                </div>

              </div>

              {/* Company */}

              <div className="form-group">

                <label>
                  Company Name
                </label>

                <div className="signup-input-wrapper">

                  <FiBriefcase />

                  <input
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* Tagline */}

              <div className="form-group">

                <label>
                  Tagline
                </label>

                <div className="signup-input-wrapper">

                  <FiTag />

                  <input
                    type="text"
                    name="tagline"
                    placeholder="Your company tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* Website */}

              <div className="form-group">

                <label>
                  Website
                </label>

                <div className="signup-input-wrapper">

                  <FiGlobe />

                  <input
                    type="text"
                    name="website"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

            {/* Description */}

            <div className="form-group description-group">

              <label>
                Company Description
              </label>

              <div className="textarea-wrapper">

                <FiFileText />

                <textarea
                  name="description"
                  rows="5"
                  placeholder="Tell candidates about your company..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>

              </div>

            </div>

            {/* Logo */}

            <div className="form-group logo-group">

              <label>
                Company Logo
              </label>

              <div className="file-upload-box">

                <FiUpload />

                <div className="file-upload-content">

                  <span>
                    Upload Company Logo
                  </span>

                  <small>
                    PNG, JPG or JPEG
                  </small>

                </div>

                <input
                  type="file"
                  name="logo"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleChange}
                />

              </div>

              {formData.logo && (
                <div className="selected-file">
                  Selected: {formData.logo.name}
                </div>
              )}

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="signup-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="signup-loader"></span>
                  CREATING ACCOUNT...
                </>
              ) : (
                <>
                  CREATE ACCOUNT
                  <FiArrowRight />
                </>
              )}

            </button>

          </form>

          {/* Login */}

          <div className="already-account">

            <p>
              Already have an account?
            </p>

            <Link
              to="/login"
              className="login-link"
            >
              LOGIN NOW
            </Link>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="signup-footer">
        © {new Date().getFullYear()} Job Portal. All Rights Reserved.
      </div>

    </div>
  );
}

