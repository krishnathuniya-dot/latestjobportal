
import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiFileText,
  FiUpload,
  FiArrowRight,
  FiHome,
} from "react-icons/fi";
import "../css/seeker.css";

const SeekerPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage({
      text: "",
      type: "",
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage({
        text: "Please upload only PDF, DOC or DOCX files.",
        type: "error",
      });

      e.target.value = "";
      setResume(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        text: "Resume size must be less than 5MB.",
        type: "error",
      });

      e.target.value = "";
      setResume(null);
      return;
    }

    console.log("Selected File:", file);
    setResume(file);

    setMessage({
      text: "",
      type: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      setMessage({
        text: "Please upload your resume.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage({
        text: "",
        type: "",
      });

      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("contactNumber", formData.contactNumber);
      data.append("password", formData.password);
      data.append("resume", resume);

      const response = await fetch(
        "https://latestjobportal.onrender.com/api/registerr",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      console.log("Registration Response:", result);

      if (response.ok) {
        if (result.user) {
          localStorage.setItem(
            "candidateId",
            result.user._id
          );

          localStorage.setItem(
            "candidateName",
            result.user.fullName
          );

          console.log(
            "Saved Candidate ID:",
            result.user._id
          );

          console.log(
            "Saved Candidate Name:",
            result.user.fullName
          );
        }

        setMessage({
          text:
            result.message ||
            "Account Created Successfully!",
          type: "success",
        });

        setFormData({
          fullName: "",
          email: "",
          contactNumber: "",
          password: "",
        });

        setResume(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setTimeout(() => {
          navigate("/seekerlogin");
        }, 1500);
      } else {
        setMessage({
          text:
            result.message ||
            "Registration Failed.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      setMessage({
        text:
          "Unable to connect to server. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sk-page">

      {/* ================= HEADER ================= */}

      <div className="sk-top-header">

        <div className="sk-header-inner">

          <div className="sk-logo">
            <span>JOB</span> PORTAL
          </div>

          <h1>Job Seeker Registration</h1>

          <p>
            Create your profile and discover your
            next career opportunity
          </p>

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="sk-main">

        <div className="sk-card">

          {/* Back Home */}

          <Link
            to="/"
            className="sk-back-home"
          >
            <FiHome />
            Back To Home
          </Link>

          {/* Profile Icon */}

          <div className="sk-profile-icon">
            <FiUser />
          </div>

          {/* Title */}

          <div className="sk-title-section">

            <h2>Create Your Account</h2>

            <p>
              Fill in your details to start applying
              for jobs
            </p>

          </div>

          {/* Alert */}

          {message.text && (
            <div
              className={`sk-alert ${
                message.type === "success"
                  ? "sk-alert-success"
                  : "sk-alert-error"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="sk-form"
          >

            {/* Row 1 */}

            <div className="sk-row">

              {/* Full Name */}

              <div className="sk-group">

                <label className="sk-label">
                  Full Name *
                </label>

                <div className="sk-input-wrapper">

                  <FiUser />

                  <input
                    type="text"
                    name="fullName"
                    className="sk-input"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                </div>

              </div>

              {/* Email */}

              <div className="sk-group">

                <label className="sk-label">
                  Email Address *
                </label>

                <div className="sk-input-wrapper">

                  <FiMail />

                  <input
                    type="email"
                    name="email"
                    className="sk-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

            </div>

            {/* Row 2 */}

            <div className="sk-row">

              {/* Contact */}

              <div className="sk-group">

                <label className="sk-label">
                  Contact Number *
                </label>

                <div className="sk-input-wrapper">

                  <FiPhone />

                  <input
                    type="tel"
                    name="contactNumber"
                    className="sk-input"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    required
                  />

                </div>

              </div>

              {/* Password */}

              <div className="sk-group">

                <label className="sk-label">
                  Password *
                </label>

                <div className="sk-input-wrapper">

                  <FiLock />

                  <input
                    type="password"
                    name="password"
                    className="sk-input"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                  />

                </div>

              </div>

            </div>

            {/* Resume */}

            <div className="sk-group sk-resume-group">

              <label className="sk-label">
                Upload Resume *
              </label>

              <div
                className={`sk-file-wrapper ${
                  resume ? "has-file" : ""
                }`}
              >

                <input
                  ref={fileInputRef}
                  type="file"
                  name="resume"
                  className="sk-file-hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required={!resume}
                />

                <div className="sk-file-dummy">

                  <div className="sk-file-icon">
                    {resume ? (
                      <FiFileText />
                    ) : (
                      <FiUpload />
                    )}
                  </div>

                  <div className="sk-file-content">

                    <p className="sk-file-text">
                      {resume
                        ? resume.name
                        : "Upload your resume"}
                    </p>

                    <p className="sk-file-hint">
                      {resume
                        ? "Resume selected successfully"
                        : "Click here to browse PDF, DOC or DOCX"}
                    </p>

                    <span>
                      Maximum file size: 5MB
                    </span>

                  </div>

                </div>

              </div>

              {resume && (
                <div className="sk-selected-file">
                  ✓ Resume ready to upload
                </div>
              )}

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="sk-submit-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="sk-loader"></span>
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

          <div className="sk-login-section">

            <p>
              Already have an account?
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/seekerlogin")
              }
              className="sk-login-link"
            >
              LOGIN NOW
            </button>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="sk-footer">
        © {new Date().getFullYear()} Job Portal.
        All Rights Reserved.
      </div>

    </div>
  );
};

export default SeekerPage;

