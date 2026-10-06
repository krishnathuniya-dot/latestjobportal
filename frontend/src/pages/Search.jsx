// 📂 Jobs.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaBriefcase,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaCalendarAlt,
  FaArrowRight,
  FaBuilding,
  FaClock,
  FaRedo,
} from "react-icons/fa";

import "../css/serach.css";

const API_URL = "https://latestjobportal.onrender.com";

export default function Search() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 6;

  // =========================================
  // FETCH JOBS
  // =========================================
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/managejob`
      );

      const data = await response.json();

      console.log("Jobs Response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch jobs"
        );
      }

      const jobList =
        Array.isArray(data)
          ? data
          : Array.isArray(data.jobs)
          ? data.jobs
          : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.job)
          ? data.job
          : [];

      setJobs(jobList);
    } catch (err) {
      console.error("Jobs Error:", err);

      setError(
        err.message ||
          "Unable to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // =========================================
  // SEARCH
  // =========================================
  const filteredJobs = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return jobs;
    }

    return jobs.filter((job) => {
      const title =
        job?.jobTitle?.toLowerCase() || "";

      const category =
        job?.category?.toLowerCase() || "";

      const location =
        job?.location?.toLowerCase() || "";

      const jobType =
        job?.jobType?.toLowerCase() || "";

      const company =
        job?.employerId?.companyName?.toLowerCase() ||
        "";

      return (
        title.includes(value) ||
        category.includes(value) ||
        location.includes(value) ||
        jobType.includes(value) ||
        company.includes(value)
      );
    });
  }, [jobs, search]);

  // =========================================
  // PAGINATION
  // =========================================
  const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
  );

  const startIndex =
    (currentPage - 1) * jobsPerPage;

  const currentJobs = filteredJobs.slice(
    startIndex,
    startIndex + jobsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // =========================================
  // DATE FORMAT
  // =========================================
  const formatDate = (date) => {
    if (!date) return "Recently Posted";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently Posted";
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
  // SALARY
  // =========================================
  const getSalary = (job) => {
    if (job?.salary) {
      return job.salary;
    }

    if (
      job?.minSalary ||
      job?.maxSalary
    ) {
      return `${job.minSalary || ""} - ${
        job.maxSalary || ""
      }`;
    }

    return "Salary not disclosed";
  };

  // =========================================
  // COMPANY LOGO
  // =========================================
  const getLogo = (job) => {
    const logo =
      job?.employerId?.logo ||
      job?.logo;

    if (!logo) {
      return "";
    }

    if (logo.startsWith("http")) {
      return logo;
    }

    return `${API_URL}/uploads/${logo}`;
  };

  return (
    <div className="jobs-page">

      {/* =========================================
          TOP BANNER
      ========================================= */}

      <section className="top-banner">

        <div className="top-banner-content">

          <span className="banner-tag">
            <FaBriefcase />
            EMPLOYER JOBS
          </span>

          <h1>
            Find Your Next
            <span> Career Opportunity</span>
          </h1>

          <p>
            Explore the latest job opportunities
            from trusted companies and apply for
            the position that matches your skills.
          </p>

        </div>

      </section>

      {/* =========================================
          SEARCH SECTION
      ========================================= */}

      <section className="search-section">

        <div className="search-box">

          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search by job title, company, location or category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}

          <button
            type="button"
            className="search-button"
          >
            <FaSearch />
            Search
          </button>

        </div>

      </section>

      {/* =========================================
          LATEST JOBS HEADER
      ========================================= */}

      <section className="latest-jobs">

        <div className="jobs-heading">

          <div>
            <span className="section-label">
              CAREER OPPORTUNITIES
            </span>

            <h2>
              Latest Jobs
            </h2>

            <p>
              {loading
                ? "Finding the latest opportunities..."
                : `${filteredJobs.length} jobs available`}
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchJobs}
            disabled={loading}
          >
            <FaRedo
              className={
                loading
                  ? "refresh-loading"
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
          <div className="jobs-error">

            <div>
              <strong>
                Unable to load jobs
              </strong>

              <p>{error}</p>
            </div>

            <button onClick={fetchJobs}>
              Try Again
            </button>

          </div>
        )}

        {/* =========================================
            LOADING
        ========================================= */}

        {loading && (
          <div className="jobs-grid">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  className="job-card skeleton-card"
                  key={item}
                >
                  <div className="skeleton-logo"></div>

                  <div className="skeleton-line large"></div>

                  <div className="skeleton-line"></div>

                  <div className="skeleton-line small"></div>

                  <div className="skeleton-bottom"></div>
                </div>
              )
            )}

          </div>
        )}

        {/* =========================================
            NO JOBS
        ========================================= */}

        {!loading &&
          !error &&
          currentJobs.length === 0 && (
            <div className="no-jobs">

              <div className="no-jobs-icon">
                <FaBriefcase />
              </div>

              <h3>
                No Jobs Found
              </h3>

              <p>
                We couldn't find any jobs matching
                your search.
              </p>

              {search && (
                <button
                  onClick={() =>
                    setSearch("")
                  }
                >
                  View All Jobs
                </button>
              )}

            </div>
          )}

        {/* =========================================
            JOB GRID
        ========================================= */}

        {!loading &&
          !error &&
          currentJobs.length > 0 && (
            <div className="jobs-grid">

              {currentJobs.map((job) => {

                const logo =
                  getLogo(job);

                const companyName =
                  job?.employerId
                    ?.companyName ||
                  job?.companyName ||
                  "Company";

                return (
                  <div
                    className="job-card"
                    key={job._id}
                    onClick={() =>
                      navigate(
                        `/apply/${job._id}`
                      )
                    }
                  >

                    {/* Card Top */}

                    <div className="job-card-top">

                      <div className="company-logo">

                        {logo ? (
                          <img
                            src={logo}
                            alt={
                              companyName
                            }
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";

                              e.currentTarget.parentElement
                                .querySelector(
                                  ".logo-fallback"
                                )
                                ?.classList.add(
                                  "show-logo-fallback"
                                );
                            }}
                          />
                        ) : null}

                        <div className="logo-fallback">
                          {companyName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                      </div>

                      <span className="job-type">
                        {job?.jobType ||
                          "Full Time"}
                      </span>

                    </div>

                    {/* Job Title */}

                    <div className="job-main">

                      <span className="job-category">
                        {job?.category ||
                          "Job Opportunity"}
                      </span>

                      <h3>
                        {job?.jobTitle ||
                          "Job Position"}
                      </h3>

                      <div className="company-name">

                        <FaBuilding />

                        {companyName}

                      </div>

                    </div>

                    {/* Job Details */}

                    <div className="job-details">

                      <div>
                        <FaMapMarkerAlt />

                        <span>
                          {job?.location ||
                            "Location not specified"}
                        </span>
                      </div>

                      <div>
                        <FaRupeeSign />

                        <span>
                          {getSalary(job)}
                        </span>
                      </div>

                      <div>
                        <FaCalendarAlt />

                        <span>
                          {formatDate(
                            job?.createdAt ||
                            job?.date
                          )}
                        </span>
                      </div>

                    </div>

                    {/* Card Footer */}

                    <div className="job-card-footer">

                      <span className="posted-time">
                        <FaClock />
                        Recently Posted
                      </span>

                      <span className="view-job">
                        View Job
                        <FaArrowRight />
                      </span>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        {/* =========================================
            PAGINATION
        ========================================= */}

        {!loading &&
          !error &&
          totalPages > 1 && (
            <div className="pagination">

              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev - 1
                  )
                }
              >
                Previous
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  className={
                    currentPage === page
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page}
                </button>
              ))}

              <button
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev + 1
                  )
                }
              >
                Next
              </button>

            </div>
          )}

      </section>

    </div>
  );
}