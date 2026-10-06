import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiStar,
  FiUser,
} from "react-icons/fi";
import "../css/apply.css";

const BASE_URL = "https://latestjobportal.onrender.com";

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // =========================
  // Fetch Single Job
  // =========================
  const fetchSingleJob = async () => {
    setLoading(true);

    setMessage({
      type: "",
      text: "",
    });

    try {
      const response = await fetch(
        `${BASE_URL}/api/managejob/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch job details");
      }

      const data = await response.json();

      const jobData =
        data?.job ||
        data?.data ||
        data;

      setJob(jobData || {});
    } catch (error) {
      console.error("Fetch Job Error:", error);

      setMessage({
        type: "error",
        text: "Unable to load job details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSingleJob();
    }
  }, [id]);

  // =========================
  // Apply Job
  // =========================
  const handleApply = async () => {
    setMessage({
      type: "",
      text: "",
    });

    let homeseekerData = null;

    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        homeseekerData = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Invalid user data:", error);
    }

    const candidateId = homeseekerData?._id;

    // =========================
    // Login Check
    // =========================
    if (!candidateId) {
      setMessage({
        type: "error",
        text: "Please login first as a job seeker to apply for this job.",
      });

      setTimeout(() => {
        navigate("/seekerlogin");
      }, 1200);

      return;
    }

    // =========================
    // Job Check
    // =========================
    if (!job?._id) {
      setMessage({
        type: "error",
        text: "Job information is not available.",
      });

      return;
    }

    setApplyLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/applyjob`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            candidateId,
            jobId: job._id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text:
            data?.message ||
            "Job applied successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text:
            data?.message ||
            "Application failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Apply Job Error:", error);

      setMessage({
        type: "error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setApplyLoading(false);
    }
  };

  // =========================
  // Company Details
  // =========================
  const companyName =
    job?.employerId?.companyName ||
    "Company";

  const companyInitial =
    companyName.charAt(0).toUpperCase();

  const companyLogo =
    job?.employerId?.logo
      ? `${BASE_URL}/uploads/${job.employerId.logo}`
      : null;

  // =========================
  // Format Date
  // =========================
  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "N/A";
    }
  };

  // =========================
  // Skills
  // =========================
  const skills =
    typeof job?.skillRequired === "string"
      ? job.skillRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="apply_loading_page">
        <div className="apply_loader"></div>

        <h3>
          Loading Job Details...
        </h3>

        <p>
          Please wait while we fetch the job
          information.
        </p>
      </div>
    );
  }

  // =========================
  // Main UI
  // =========================
  return (
    <div className="jobdetails_main">
      <div className="jobdetails_wrapper">

        {/* =================================
            LEFT CONTENT
        ================================== */}
        <main className="jobdetails_content">

          {/* =========================
              Message
          ========================== */}
          {message.text && (
            <div
              className={`apply_message ${
                message.type === "success"
                  ? "apply_success"
                  : "apply_error"
              }`}
            >
              {message.type === "success" ? (
                <FiCheckCircle />
              ) : (
                <FiAlertCircle />
              )}

              <span>
                {message.text}
              </span>
            </div>
          )}

          {/* =========================
              Job Header
          ========================== */}
          <section className="jobdetails_header">

            {/* Company Logo */}
            <div className="company_logo_wrapper">

              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="company_logo"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";

                    const fallback =
                      e.currentTarget.parentElement.querySelector(
                        ".fallback_logo"
                      );

                    if (fallback) {
                      fallback.style.display =
                        "flex";
                    }
                  }}
                />
              ) : null}

              <div
                className="fallback_logo"
                style={{
                  display: companyLogo
                    ? "none"
                    : "flex",
                }}
              >
                {companyInitial}
              </div>

            </div>

            {/* Job Information */}
            <div className="jobdetails_info_box">

              <span className="jobdetails_badge">
                <FiBriefcase />

                {job?.jobType || "Job"}
              </span>

              <h1>
                {job?.jobTitle ||
                  "Job Title"}
              </h1>

              <p className="company_name">
                {companyName}
              </p>

              {/* Meta */}
              <div className="job_meta">

                <span>
                  <FiMapPin />

                  {job?.jobLocation ||
                    "Location not specified"}
                </span>

                <span>
                  <FiCalendar />

                  {formatDate(
                    job?.createdAt
                  )}
                </span>

              </div>

              {/* Salary */}
              <div className="salary_box">

                <FiDollarSign />

                <div>
                  <small>
                    Salary Package
                  </small>

                  <strong>
                    ₹
                    {job?.salaryPackage ||
                      "Not disclosed"}
                  </strong>
                </div>

              </div>

              {/* Actions */}
              <div className="job_actions">

                <span className="fulltime_btn">
                  <FiClock />

                  {job?.jobType ||
                    "Full Time"}
                </span>

                <button
                  className="apply_btn"
                  onClick={handleApply}
                  disabled={applyLoading}
                >
                  {applyLoading ? (
                    <>
                      <span className="apply_button_spinner"></span>
                      Applying...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      APPLY FOR THIS JOB
                    </>
                  )}
                </button>

              </div>

            </div>
          </section>

          {/* =========================
              Job Overview
          ========================== */}
          <section className="detail_section">

            <div className="section_title">

              <span className="section_icon">
                <FiBriefcase />
              </span>

              <div>
                <h3>
                  Job Overview
                </h3>

                <p>
                  About this opportunity
                </p>
              </div>

            </div>

            <p className="detail_text">
              {job?.jobDescription ||
                "No job description available."}
            </p>

          </section>

          {/* =========================
              Experience
          ========================== */}
          <section className="detail_section">

            <div className="section_title">

              <span className="section_icon">
                <FiStar />
              </span>

              <div>
                <h3>
                  Required Experience
                </h3>

                <p>
                  Experience expected for
                  this position
                </p>
              </div>

            </div>

            <div className="info_highlight">
              {job?.experience ||
                "Not specified"}
            </div>

          </section>

          {/* =========================
              Skills
          ========================== */}
          <section className="detail_section">

            <div className="section_title">

              <span className="section_icon">
                <FiCheckCircle />
              </span>

              <div>
                <h3>
                  Skills Required
                </h3>

                <p>
                  Skills and expertise
                  required
                </p>
              </div>

            </div>

            <div className="skills_box">

              {skills.length > 0 ? (
                skills.map(
                  (skill, index) => (
                    <span
                      className="skill_tag"
                      key={index}
                    >
                      {skill}
                    </span>
                  )
                )
              ) : (
                <span className="no_data">
                  Skills not specified
                </span>
              )}

            </div>

          </section>

          {/* =========================
              Job Information
          ========================== */}
          <section className="detail_section">

            <div className="section_title">

              <span className="section_icon">
                <FiBriefcase />
              </span>

              <div>
                <h3>
                  Job Information
                </h3>

                <p>
                  Important details about
                  this job
                </p>
              </div>

            </div>

            <div className="job_information_grid">

              {/* Location */}
              <div className="information_item">

                <span>
                  <FiMapPin />
                </span>

                <div>
                  <small>
                    Location
                  </small>

                  <strong>
                    {job?.jobLocation ||
                      "Not specified"}
                  </strong>
                </div>

              </div>

              {/* Salary */}
              <div className="information_item">

                <span>
                  <FiDollarSign />
                </span>

                <div>
                  <small>
                    Salary
                  </small>

                  <strong>
                    ₹
                    {job?.salaryPackage ||
                      "Not disclosed"}
                  </strong>
                </div>

              </div>

              {/* Job Type */}
              <div className="information_item">

                <span>
                  <FiBriefcase />
                </span>

                <div>
                  <small>
                    Job Type
                  </small>

                  <strong>
                    {job?.jobType ||
                      "Not specified"}
                  </strong>
                </div>

              </div>

              {/* Posted On */}
              <div className="information_item">

                <span>
                  <FiCalendar />
                </span>

                <div>
                  <small>
                    Posted On
                  </small>

                  <strong>
                    {formatDate(
                      job?.createdAt
                    )}
                  </strong>
                </div>

              </div>

            </div>

          </section>

          {/* =========================
              Bottom Apply
          ========================== */}
          <div className="bottom_apply_box">

            <div>

              <h3>
                Interested in this job?
              </h3>

              <p>
                Apply now and take the
                next step in your career.
              </p>

            </div>

            <button
              className="apply_btn bottom_apply_btn"
              onClick={handleApply}
              disabled={applyLoading}
            >
              {applyLoading ? (
                <>
                  <span className="apply_button_spinner"></span>
                  Applying...
                </>
              ) : (
                <>
                  <FiSend />
                  Apply Now
                </>
              )}
            </button>

          </div>

        </main>

        {/* =================================
            RIGHT SIDEBAR
        ================================== */}
        <aside className="company_sidebar">

          <div className="sidebar_card">

            {/* Sidebar Logo */}
            <div className="sidebar_logo_wrapper">

              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="sidebar_banner"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";

                    const fallback =
                      e.currentTarget.parentElement.querySelector(
                        ".sidebar_fallback_logo"
                      );

                    if (fallback) {
                      fallback.style.display =
                        "flex";
                    }
                  }}
                />
              ) : null}

              <div
                className="sidebar_fallback_logo"
                style={{
                  display: companyLogo
                    ? "none"
                    : "flex",
                }}
              >
                {companyInitial}
              </div>

            </div>

            {/* Sidebar Body */}
            <div className="sidebar_body">

              <span className="sidebar_company_label">
                COMPANY
              </span>

              <h2>
                {companyName}
              </h2>

              {/* Industry */}
              <div className="sidebar_item">

                <div className="sidebar_item_icon">
                  <FiBriefcase />
                </div>

                <div>
                  <strong>
                    Industry
                  </strong>

                  <p>
                    {job?.category ||
                      "Not specified"}
                  </p>
                </div>

              </div>

              {/* Business Entity */}
              <div className="sidebar_item">

                <div className="sidebar_item_icon">
                  <FiBriefcase />
                </div>

                <div>
                  <strong>
                    Type of Business Entity
                  </strong>

                  <p>
                    Pvt Ltd
                  </p>
                </div>

              </div>

              {/* Established */}
              <div className="sidebar_item">

                <div className="sidebar_item_icon">
                  <FiCalendar />
                </div>

                <div>
                  <strong>
                    Established In
                  </strong>

                  <p>
                    2000
                  </p>
                </div>

              </div>

              {/* Employees */}
              <div className="sidebar_item">

                <div className="sidebar_item_icon">
                  <FiUser />
                </div>

                <div>
                  <strong>
                    No. of Employees
                  </strong>

                  <p>
                    10000+
                  </p>
                </div>

              </div>

              {/* Location */}
              <div className="sidebar_item">

                <div className="sidebar_item_icon">
                  <FiMapPin />
                </div>

                <div>
                  <strong>
                    Location
                  </strong>

                  <p>
                    {job?.jobLocation ||
                      "Not specified"}
                  </p>
                </div>

              </div>

              {/* Sidebar Apply Button */}
              <button
                className="sidebar_apply_btn"
                onClick={handleApply}
                disabled={applyLoading}
              >
                <FiSend />

                {applyLoading
                  ? "Applying..."
                  : "Apply for this Job"}
              </button>

            </div>

          </div>

        </aside>

      </div>
    </div>
  );
}