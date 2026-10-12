
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiEye,
  FiFileText,
  FiArrowRight,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiInbox,
} from "react-icons/fi";

import "../css/applyjob.css";

const API_URL = "https://latestjobportal.onrender.com";

export default function Applyjob() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================================
  // GET CANDIDATE ID
  // =========================================
  const getCandidateId = () => {
    // Direct localStorage keys
    const directId =
      localStorage.getItem("candidateId") ||
      localStorage.getItem("userId");

    if (directId) {
      return directId;
    }

    // User object saved during seeker login
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      return (
        storedUser?._id ||
        storedUser?.id ||
        storedUser?.candidateId ||
        ""
      );
    } catch (error) {
      console.error("Unable to read user data:", error);
      return "";
    }
  };

  // =========================================
  // FETCH APPLICATIONS
  // =========================================
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const candidateId = getCandidateId();

      console.log("Candidate ID:", candidateId);

      if (!candidateId) {
        setApplications([]);
        setError(
          "Candidate login details were not found. Please login as a job seeker."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/api/my-applications/${encodeURIComponent(
          candidateId
        )}`
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("Applications response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to fetch applications."
        );
      }

      // Support common backend response structures
      const applicationData =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.applications)
          ? data.applications
          : Array.isArray(data?.data?.applications)
          ? data.data.applications
          : [];

      if (
        data?.success === false &&
        applicationData.length === 0
      ) {
        throw new Error(
          data?.message ||
            "Unable to fetch applications."
        );
      }

      setApplications(applicationData);
    } catch (error) {
      console.error("Applications Error:", error);

      setError(
        error.message ||
          "Something went wrong while loading applications."
      );

      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // =========================================
  // DATE FORMAT
  // =========================================
  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // TIME FORMAT
  // =========================================
  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================
  // STATUS CLASS
  // =========================================
  const getStatusClass = (status) => {
    const value = String(status || "Pending").toLowerCase();

    if (
      value.includes("accept") ||
      value.includes("approved")
    ) {
      return "status-accepted";
    }

    if (
      value.includes("reject") ||
      value.includes("declined")
    ) {
      return "status-rejected";
    }

    if (
      value.includes("interview") ||
      value.includes("shortlist")
    ) {
      return "status-interview";
    }

    return "status-pending";
  };

  // =========================================
  // CLOUDINARY + LEGACY LOGO SUPPORT
  // =========================================
  const getLogo = (item) => {
    const logo = item?.jobId?.employerId?.logo;

    if (!logo || typeof logo !== "string") {
      return "";
    }

    const cleanLogo = logo.trim();

    // Cloudinary or another complete image URL
    if (/^https?:\/\//i.test(cleanLogo)) {
      return cleanLogo;
    }

    // Legacy local uploads
    return `${API_URL}/uploads/${cleanLogo.replace(
      /^\/+/,
      ""
    )}`;
  };

  // =========================================
  // NORMALIZE SKILLS
  // =========================================
  const getSkills = (job) => {
    const rawSkills =
      job?.skillRequired ??
      job?.skills ??
      "";

    if (Array.isArray(rawSkills)) {
      return rawSkills
        .map((skill) => String(skill).trim())
        .filter(Boolean);
    }

    if (typeof rawSkills === "string") {
      return rawSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    return [];
  };

  // =========================================
  // LOADING UI
  // =========================================
  return (
    <div className="my-applications-page">
      {/* =========================================
          HERO
      ========================================= */}
      <section className="applications-hero">
        <div className="applications-hero-content">
          <div className="applications-hero-icon">
            <FiBriefcase />
          </div>

          <div>
            <span>CANDIDATE DASHBOARD</span>

            <h1>My Applications</h1>

            <p>
              Track all your job applications and check
              their latest status.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          MAIN
      ========================================= */}
      <main className="applications-main">
        {/* HEADER */}
        <div className="applications-heading">
          <div>
            <span className="applications-label">
              APPLICATION HISTORY
            </span>

            <h2>Your Job Applications</h2>

            <p>
              {loading
                ? "Loading your applications..."
                : `${applications.length} application${
                    applications.length !== 1 ? "s" : ""
                  } found`}
            </p>
          </div>

          <button
            type="button"
            className="applications-refresh"
            onClick={fetchApplications}
            disabled={loading}
          >
            <FiRefreshCw
              className={
                loading ? "applications-spin" : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* =========================================
            ERROR
        ========================================= */}
        {error && (
          <div className="applications-error">
            <div className="applications-error-icon">
              <FiAlertCircle />
            </div>

            <div>
              <strong>
                Unable to load applications
              </strong>

              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (
                  error.toLowerCase().includes("login")
                ) {
                  navigate("/seekerlogin");
                } else {
                  fetchApplications();
                }
              }}
            >
              {error.toLowerCase().includes("login")
                ? "Login"
                : "Try Again"}
            </button>
          </div>
        )}

        {/* =========================================
            LOADING SKELETON
        ========================================= */}
        {loading && (
          <div className="applications-list">
            {[1, 2, 3].map((item) => (
              <div
                className="application-card application-skeleton"
                key={item}
              >
                <div className="skeleton-company-logo"></div>

                <div className="skeleton-content">
                  <div className="skeleton-line title"></div>
                  <div className="skeleton-line medium"></div>
                  <div className="skeleton-line small"></div>
                  <div className="skeleton-details"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================================
            EMPTY STATE
        ========================================= */}
        {!loading &&
          !error &&
          applications.length === 0 && (
            <div className="applications-empty">
              <div className="empty-icon">
                <FiInbox />
              </div>

              <h3>No Applications Found</h3>

              <p>
                You haven't applied for any jobs yet.
                Start exploring jobs and apply for your
                desired position.
              </p>

              <button
                type="button"
                onClick={() => navigate("/hhome")}
              >
                <FiBriefcase />
                Explore Jobs
              </button>
            </div>
          )}

        {/* =========================================
            APPLICATION LIST
        ========================================= */}
        {!loading &&
          !error &&
          applications.length > 0 && (
            <div className="applications-list">
              {applications.map((item, index) => {
                const job =
                  item?.jobId &&
                  typeof item.jobId === "object"
                    ? item.jobId
                    : {};

                const employer =
                  job?.employerId &&
                  typeof job.employerId === "object"
                    ? job.employerId
                    : {};

                const logo = getLogo(item);

                const companyName =
                  employer?.companyName ||
                  "Company";

                const companyInitial =
                  companyName.charAt(0).toUpperCase();

                const jobTitle =
                  job?.jobTitle || "Job Title";

                const location =
                  job?.jobLocation ||
                  job?.location ||
                  "Location Not Available";

                const salary =
                  job?.salaryPackage ||
                  job?.salary ||
                  "Not Mentioned";

                const skills = getSkills(job);

                const status =
                  item?.status || "Pending";

                return (
                  <article
                    className="application-card"
                    key={
                      item?._id ||
                      item?.id ||
                      `${job?._id || "job"}-${index}`
                    }
                  >
                    {/* COMPANY LOGO */}
                    <div className="application-company">
                      <div className="application-logo">
                        {logo && (
                          <img
                            src={logo}
                            alt={`${companyName} logo`}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display =
                                "none";

                              const fallback =
                                e.currentTarget.parentElement?.querySelector(
                                  ".application-logo-fallback"
                                );

                              fallback?.classList.add("show");
                            }}
                          />
                        )}

                        <div
                          className={`application-logo-fallback ${
                            logo ? "" : "show"
                          }`}
                        >
                          {companyInitial}
                        </div>
                      </div>
                    </div>

                    {/* APPLICATION CONTENT */}
                    <div className="application-content">
                      <div className="application-top">
                        <div>
                          <span className="application-category">
                            JOB APPLICATION
                          </span>

                          <h2>{jobTitle}</h2>

                          <h3>
                            <FiBriefcase />
                            {companyName}
                          </h3>
                        </div>

                        <span
                          className={`application-status ${getStatusClass(
                            status
                          )}`}
                        >
                          <FiCheckCircle />
                          {status}
                        </span>
                      </div>

                      {/* APPLIED DATE */}
                      <div className="application-date">
                        <span>
                          <FiCalendar />

                          Applied on{" "}
                          <strong>
                            {formatDate(item?.createdAt)}
                          </strong>
                        </span>

                        {formatTime(item?.createdAt) && (
                          <span>
                            <FiClock />
                            {formatTime(item?.createdAt)}
                          </span>
                        )}
                      </div>

                      {/* JOB DETAILS */}
                      <div className="application-details">
                        <div>
                          <FiMapPin />

                          <span>
                            <small>Location</small>
                            {location}
                          </span>
                        </div>

                        <div>
                          <FiDollarSign />

                          <span>
                            <small>Salary</small>
                            {typeof salary === "number"
                              ? `₹${salary}`
                              : salary === "Not Mentioned"
                              ? salary
                              : `₹${salary}`}
                          </span>
                        </div>
                      </div>

                      {/* SKILLS */}
                      <div className="application-skills">
                        <div className="skills-heading">
                          <FiFileText />
                          Required Skills
                        </div>

                        <div className="skill-tags">
                          {skills.length > 0 ? (
                            skills.map((skill, skillIndex) => (
                              <span
                                key={`${skill}-${skillIndex}`}
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span>No skills mentioned</span>
                          )}
                        </div>
                      </div>

                      {/* BUTTONS */}
                      <div className="application-actions">
                        <button
                          type="button"
                          className="view-job-btn"
                          onClick={() => {
                            if (job?._id) {
                              navigate(`/apply/${job._id}`);
                            }
                          }}
                          disabled={!job?._id}
                        >
                          <FiEye />
                          View Job
                        </button>

                        <button
                          type="button"
                          className="application-details-btn"
                          onClick={() => {
                            if (item?._id) {
                              navigate(
                                `/application/${item._id}`
                              );
                            }
                          }}
                          disabled={!item?._id}
                        >
                          <FiFileText />
                          Application Details
                          <FiArrowRight />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </main>
    </div>
  );
}
