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
  // FETCH APPLICATIONS
  // =========================================
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const candidateId =
        localStorage.getItem("candidateId");

      if (!candidateId) {
        setApplications([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/my-applications/${candidateId}`
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("Applications =", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to fetch applications."
        );
      }

      if (data?.success) {
        setApplications(
          Array.isArray(data.data)
            ? data.data
            : []
        );
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error(
        "Applications Error:",
        error
      );

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

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // TIME FORMAT
  // =========================================
  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =========================================
  // STATUS CLASS
  // =========================================
  const getStatusClass = (status) => {
    const value =
      status?.toLowerCase() || "pending";

    if (value.includes("accept")) {
      return "status-accepted";
    }

    if (value.includes("reject")) {
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
  // LOGO
  // =========================================
  const getLogo = (item) => {
    const logo =
      item?.jobId?.employerId?.logo;

    if (!logo) {
      return "";
    }

    if (logo.startsWith("http")) {
      return logo;
    }

    return `${API_URL}/uploads/${logo}`;
  };

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
            <span>
              CANDIDATE DASHBOARD
            </span>

            <h1>
              My Applications
            </h1>

            <p>
              Track all your job applications
              and check their latest status.
            </p>
          </div>

        </div>

      </section>

      {/* =========================================
          MAIN
      ========================================= */}

      <main className="applications-main">

        {/* Header */}

        <div className="applications-heading">

          <div>
            <span className="applications-label">
              APPLICATION HISTORY
            </span>

            <h2>
              Your Job Applications
            </h2>

            <p>
              {loading
                ? "Loading your applications..."
                : `${applications.length} application${
                    applications.length !== 1
                      ? "s"
                      : ""
                  } found`}
            </p>
          </div>

          <button
            className="applications-refresh"
            onClick={fetchApplications}
            disabled={loading}
          >
            <FiRefreshCw
              className={
                loading
                  ? "applications-spin"
                  : ""
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

              <p>
                {error}
              </p>
            </div>

            <button
              onClick={fetchApplications}
            >
              Try Again
            </button>

          </div>
        )}

        {/* =========================================
            LOADING
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
            EMPTY
        ========================================= */}

        {!loading &&
          !error &&
          applications.length === 0 && (
            <div className="applications-empty">

              <div className="empty-icon">
                <FiInbox />
              </div>

              <h3>
                No Applications Found
              </h3>

              <p>
                You haven't applied for any jobs yet.
                Start exploring jobs and apply for
                your desired position.
              </p>

              <button
                onClick={() =>
                  navigate("/hhome")
                }
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

              {applications.map((item) => {

                const job =
                  item?.jobId || {};

                const employer =
                  job?.employerId || {};

                const logo =
                  getLogo(item);

                const companyName =
                  employer?.companyName ||
                  "Company";

                const jobTitle =
                  job?.jobTitle ||
                  "Job Title";

                const location =
                  job?.jobLocation ||
                  job?.location ||
                  "Location Not Available";

                const salary =
                  job?.salaryPackage ||
                  job?.salary ||
                  "Not Mentioned";

                const skills =
                  job?.skillRequired ||
                  job?.skills ||
                  "";

                const status =
                  item?.status ||
                  "Pending";

                return (
                  <article
                    className="application-card"
                    key={item._id}
                  >

                    {/* =================================
                        COMPANY LOGO
                    ================================= */}

                    <div className="application-company">

                      <div className="application-logo">

                        {logo ? (
                          <img
                            src={logo}
                            alt={companyName}
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";

                              e.currentTarget.parentElement
                                .querySelector(
                                  ".application-logo-fallback"
                                )
                                ?.classList.add(
                                  "show"
                                );
                            }}
                          />
                        ) : null}

                        <div className="application-logo-fallback">
                          {companyName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                      </div>

                    </div>

                    {/* =================================
                        CONTENT
                    ================================= */}

                    <div className="application-content">

                      <div className="application-top">

                        <div>

                          <span className="application-category">
                            JOB APPLICATION
                          </span>

                          <h2>
                            {jobTitle}
                          </h2>

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

                      {/* =================================
                          APPLIED DATE
                      ================================= */}

                      <div className="application-date">

                        <span>
                          <FiCalendar />

                          Applied on{" "}
                          <strong>
                            {formatDate(
                              item?.createdAt
                            )}
                          </strong>
                        </span>

                        {formatTime(
                          item?.createdAt
                        ) && (
                          <span>
                            <FiClock />

                            {formatTime(
                              item?.createdAt
                            )}
                          </span>
                        )}

                      </div>

                      {/* =================================
                          JOB DETAILS
                      ================================= */}

                      <div className="application-details">

                        <div>
                          <FiMapPin />

                          <span>
                            <small>
                              Location
                            </small>

                            {location}
                          </span>
                        </div>

                        <div>
                          <FiDollarSign />

                          <span>
                            <small>
                              Salary
                            </small>

                            ₹{salary}
                          </span>
                        </div>

                      </div>

                      {/* =================================
                          SKILLS
                      ================================= */}

                      <div className="application-skills">

                        <div className="skills-heading">
                          <FiFileText />
                          Required Skills
                        </div>

                        <div className="skill-tags">

                          {skills ? (
                            skills
                              .split(",")
                              .map(
                                (
                                  skill,
                                  index
                                ) => (
                                  <span
                                    key={
                                      index
                                    }
                                  >
                                    {skill.trim()}
                                  </span>
                                )
                              )
                          ) : (
                            <span>
                              No skills mentioned
                            </span>
                          )}

                        </div>

                      </div>

                      {/* =================================
                          BUTTONS
                      ================================= */}

                      <div className="application-actions">

                        <button
                          className="view-job-btn"
                          onClick={() =>
                            navigate(
                              `/apply/${job?._id}`
                            )
                          }
                        >
                          <FiEye />
                          View Job
                        </button>

                        <button
                          className="application-details-btn"
                          onClick={() =>
                            navigate(
                              `/application/${item._id}`
                            )
                          }
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