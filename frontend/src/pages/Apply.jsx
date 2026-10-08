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
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // ==========================================
  // FETCH SINGLE JOB
  // ==========================================
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch job details"
        );
      }

      const jobData =
        data?.job ||
        data?.data ||
        data;

      console.log("========== JOB DETAILS ==========");
      console.log("Job:", jobData);
      console.log("Job ID:", jobData?._id);

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

  // ==========================================
  // GET LOGGED-IN CANDIDATE
  // ==========================================
  const getCandidateId = () => {
    let storedUser = null;

    // ------------------------------------------
    // First check "user"
    // ------------------------------------------
    try {
      const userData = localStorage.getItem("user");

      if (userData) {
        storedUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error(
        "Invalid user data:",
        error
      );
    }

    console.log(
      "========== STORED USER =========="
    );
    console.log("Stored User:", storedUser);

    // ------------------------------------------
    // Candidate ID fallback
    // ------------------------------------------
    const candidateId =
      storedUser?._id ||
      storedUser?.id ||
      localStorage.getItem("candidateId") ||
      localStorage.getItem("userId");

    console.log(
      "Candidate ID:",
      candidateId
    );

    return candidateId;
  };

  // ==========================================
  // APPLY JOB
  // ==========================================
  const handleApply = async () => {
    if (applyLoading || alreadyApplied) {
      return;
    }

    setMessage({
      type: "",
      text: "",
    });

    // ------------------------------------------
    // Candidate ID
    // ------------------------------------------
    const candidateId = getCandidateId();

    // ------------------------------------------
    // Candidate Login Check
    // ------------------------------------------
    if (!candidateId) {
      setMessage({
        type: "error",
        text:
          "Please login first as a job seeker to apply for this job.",
      });

      setTimeout(() => {
        navigate("/seekerlogin");
      }, 1200);

      return;
    }

    // ------------------------------------------
    // Job Check
    // ------------------------------------------
    if (!job?._id) {
      setMessage({
        type: "error",
        text:
          "Job information is not available.",
      });

      return;
    }

    console.log(
      "========== APPLY JOB =========="
    );
    console.log("Candidate ID:", candidateId);
    console.log("Job ID:", job._id);

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
            candidateId: candidateId,
            jobId: job._id,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "========== APPLY RESPONSE =========="
      );
      console.log("Status:", response.status);
      console.log("Response:", data);

      // ------------------------------------------
      // Success
      // ------------------------------------------
      if (
        response.ok &&
        data?.success
      ) {
        setAlreadyApplied(true);

        setMessage({
          type: "success",
          text:
            data?.message ||
            "Job applied successfully!",
        });

        return;
      }

      // ------------------------------------------
      // Duplicate Application
      // ------------------------------------------
      if (
        response.status === 400 &&
        data?.message
          ?.toLowerCase()
          .includes("already")
      ) {
        setAlreadyApplied(true);

        setMessage({
          type: "error",
          text: data.message,
        });

        return;
      }

      // ------------------------------------------
      // Other Error
      // ------------------------------------------
      setMessage({
        type: "error",
        text:
          data?.message ||
          "Application failed. Please try again.",
      });
    } catch (error) {
      console.error(
        "Apply Job Error:",
        error
      );

      setMessage({
        type: "error",
        text:
          "Something went wrong. Please try again later.",
      });
    } finally {
      setApplyLoading(false);
    }
  };

  // ==========================================
  // COMPANY DETAILS
  // ==========================================
  const companyName =
    job?.employerId?.companyName ||
    "Company";

  const companyInitial =
    companyName.charAt(0).toUpperCase();

  const companyLogo =
    job?.employerId?.logo
      ? `${BASE_URL}/uploads/${job.employerId.logo}`
      : null;

  // ==========================================
  // FORMAT DATE
  // ==========================================
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

  // ==========================================
  // SKILLS
  // ==========================================
  const skills =
    typeof job?.skillRequired === "string"
      ? job.skillRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  // ==========================================
  // LOADING
  // ==========================================
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

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <div className="jobdetails_main">
      <div className="jobdetails_wrapper">

        {/* =================================
            LEFT CONTENT
        ================================== */}
        <main className="jobdetails_content">

          {/* MESSAGE */}
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

          {/* JOB HEADER */}
          <section className="jobdetails_header">

            {/* COMPANY LOGO */}
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

            {/* JOB INFORMATION */}
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

              {/* META */}
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

              {/* SALARY */}
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

              {/* ACTIONS */}
              <div className="job_actions">

                <span className="fulltime_btn">
                  <FiClock />

                  {job?.jobType ||
                    "Full Time"}
                </span>

                <button
                  type="button"
                  className="apply_btn"
                  onClick={handleApply}
                  disabled={
                    applyLoading ||
                    alreadyApplied
                  }
                >
                  {applyLoading ? (
                    <>
                      <span className="apply_button_spinner"></span>

                      Applying...
                    </>
                  ) : alreadyApplied ? (
                    <>
                      <FiCheckCircle />

                      Applied
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

          {/* JOB OVERVIEW */}
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

          {/* EXPERIENCE */}
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

          {/* SKILLS */}
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

          {/* JOB INFORMATION */}
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

              {/* LOCATION */}
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

              {/* SALARY */}
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

              {/* JOB TYPE */}
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

              {/* POSTED ON */}
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

          {/* BOTTOM APPLY */}
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
              type="button"
              className="apply_btn bottom_apply_btn"
              onClick={handleApply}
              disabled={
                applyLoading ||
                alreadyApplied
              }
            >
              {applyLoading ? (
                <>
                  <span className="apply_button_spinner"></span>

                  Applying...
                </>
              ) : alreadyApplied ? (
                <>
                  <FiCheckCircle />

                  Applied
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

            {/* SIDEBAR LOGO */}
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

            {/* SIDEBAR BODY */}
            <div className="sidebar_body">

              <span className="sidebar_company_label">
                COMPANY
              </span>

              <h2>
                {companyName}
              </h2>

              {/* INDUSTRY */}
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

              {/* BUSINESS ENTITY */}
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

              {/* ESTABLISHED */}
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

              {/* EMPLOYEES */}
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

              {/* LOCATION */}
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

              {/* SIDEBAR APPLY */}
              <button
                type="button"
                className="sidebar_apply_btn"
                onClick={handleApply}
                disabled={
                  applyLoading ||
                  alreadyApplied
                }
              >
                <FiSend />

                {applyLoading
                  ? "Applying..."
                  : alreadyApplied
                  ? "Applied"
                  : "Apply for this Job"}
              </button>

            </div>

          </div>

        </aside>

      </div>
    </div>
  );
}