import React, { useEffect, useMemo, useState } from "react";
import {
  FiBriefcase,
  FiSearch,
  FiHome,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiArrowRight,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import "../css/recenthotjob.css";

const BASE_URL = "https://latestjobportal.onrender.com";

export default function Searchbar() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  const navigate = useNavigate();

  // =========================
  // Fetch Jobs
  // =========================
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${BASE_URL}/api/managejob`);

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();

      console.log("Jobs Response:", data);

      const allJobs = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : Array.isArray(data?.jobs)
        ? data.jobs
        : Array.isArray(data?.job)
        ? data.job
        : [];

      setJobs(allJobs);
    } catch (error) {
      console.error("Fetch Jobs Error:", error);

      setJobs([]);

      setError("Unable to load jobs right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // =========================
  // Search Results
  // =========================
  const filteredJobs = useMemo(() => {
    const searchTitle = jobTitle.trim().toLowerCase();
    const searchCompany = companyName.trim().toLowerCase();

    return jobs.filter((job) => {
      const title = job?.jobTitle?.toLowerCase() || "";

      const company =
        job?.employerId?.companyName?.toLowerCase() ||
        job?.companyName?.toLowerCase() ||
        "";

      const category = job?.category?.toLowerCase() || "";

      const location =
        job?.jobLocation?.toLowerCase() ||
        job?.location?.toLowerCase() ||
        "";

      const jobType = job?.jobType?.toLowerCase() || "";

      const titleMatch =
        !searchTitle ||
        title.includes(searchTitle) ||
        category.includes(searchTitle) ||
        location.includes(searchTitle) ||
        jobType.includes(searchTitle);

      const companyMatch =
        !searchCompany ||
        company.includes(searchCompany);

      return titleMatch && companyMatch;
    });
  }, [jobs, jobTitle, companyName]);

  // =========================
  // Clear Search
  // =========================
  const clearSearch = () => {
    setJobTitle("");
    setCompanyName("");
  };

  // =========================
  // Logo Error
  // =========================
  const handleLogoError = (e) => {
    e.currentTarget.style.display = "none";

    const fallback =
      e.currentTarget.parentElement.querySelector(
        ".rhj_fallback_logo"
      );

    if (fallback) {
      fallback.style.display = "flex";
    }
  };

  return (
    <div className="search-page">
      {/* =================================
          HERO SEARCH SECTION
      ================================= */}
      <section className="job-search-hero">
        <div className="job-search-hero-content">
          <span className="job-search-eyebrow">
            <FiBriefcase />
            FIND YOUR NEXT OPPORTUNITY
          </span>

          <h1 className="job-search-heading">
            Find Your Dream Job
          </h1>

          <p className="job-search-description">
            Search thousands of opportunities and find the right job
            for your career.
          </p>

          <div className="job-search-container">
            {/* Job Title */}
            <div className="job-search-field">
              <FiSearch className="job-search-field-icon" />

              <div className="job-search-input-content">
                <label>Job Title or Keyword</label>

                <input
                  type="text"
                  placeholder="e.g. React Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              {jobTitle && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setJobTitle("")}
                  aria-label="Clear job title"
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* Company */}
            <div className="job-search-field">
              <FiHome className="job-search-field-icon" />

              <div className="job-search-input-content">
                <label>Company</label>

                <input
                  type="text"
                  placeholder="e.g. TCS"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              {companyName && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setCompanyName("")}
                  aria-label="Clear company"
                >
                  <FiX />
                </button>
              )}
            </div>

            <button
              type="button"
              className="job-search-submit-btn"
              onClick={() => {
                // Search is already reactive.
                // Button kept for user interaction.
              }}
            >
              <FiSearch />
              Search Jobs
            </button>
          </div>

          {(jobTitle || companyName) && (
            <button
              type="button"
              className="clear-all-search"
              onClick={clearSearch}
            >
              <FiX />
              Clear Search
            </button>
          )}
        </div>
      </section>

      {/* =================================
          RESULTS SECTION
      ================================= */}
      <section className="recent_hot_jobs_container">
        <div className="rhj_results_header">
          <div>
            <span className="rhj_results_label">
              JOB OPPORTUNITIES
            </span>

            <h2 className="recent_hot_jobs_heading">
              Search Results
            </h2>

            {!loading && !error && (
              <p className="rhj_results_count">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} found
              </p>
            )}
          </div>

          <button
            type="button"
            className="rhj_refresh_btn"
            onClick={fetchJobs}
            disabled={loading}
          >
            <FiRefreshCw
              className={loading ? "refresh-spinning" : ""}
            />
            Refresh
          </button>
        </div>

        {/* =================================
            ERROR
        ================================= */}
        {error && (
          <div className="rhj_error_state">
            <div>
              <strong>Unable to load jobs</strong>
              <p>{error}</p>
            </div>

            <button onClick={fetchJobs}>
              Try Again
            </button>
          </div>
        )}

        {/* =================================
            JOB GRID
        ================================= */}
        <div className="rhj_jobs_grid">
          {loading ? (
            <>
              <div className="rhj_loading_card">
                <div className="rhj_skeleton_logo"></div>

                <div className="rhj_skeleton_content">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="rhj_loading_card">
                <div className="rhj_skeleton_logo"></div>

                <div className="rhj_skeleton_content">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="rhj_loading_card">
                <div className="rhj_skeleton_logo"></div>

                <div className="rhj_skeleton_content">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </>
          ) : !error && filteredJobs.length > 0 ? (
            filteredJobs.map((item) => {
              const companyName =
                item?.employerId?.companyName ||
                item?.companyName ||
                "Company";

              const companyInitial =
                companyName.charAt(0).toUpperCase() || "C";

              const logoValue =
                item?.employerId?.logo ||
                item?.logo ||
                "";

              const logo = logoValue
                ? logoValue.startsWith("http")
                  ? logoValue
                  : `${BASE_URL}/uploads/${logoValue}`
                : null;

              const location =
                item?.jobLocation ||
                item?.location ||
                "Location not specified";

              const salary =
                item?.salaryPackage ||
                item?.salary ||
                "Not Mentioned";

              return (
                <article
                  className="recent_hot_job_card"
                  key={item?._id}
                  onClick={() =>
                    navigate(`/apply/${item?._id}`)
                  }
                >
                  {/* =========================
                      CARD TOP
                  ========================== */}
                  <div className="rhj_card_top">
                    <div className="recent_hot_job_left">
                      {/* Logo */}
                      <div className="rhj_logo_wrapper">
                        {logo ? (
                          <img
                            src={logo}
                            alt={companyName}
                            className="recent_hot_logo_img"
                            onError={handleLogoError}
                          />
                        ) : null}

                        <div
                          className="rhj_fallback_logo"
                          style={{
                            display: logo ? "none" : "flex",
                          }}
                        >
                          {companyInitial}
                        </div>
                      </div>

                      {/* Job Content */}
                      <div className="recent_hot_content">
                        <span className="rhj_job_category">
                          <FiBriefcase />
                          {item?.category || "Job Opportunity"}
                        </span>

                        <h3>
                          {item?.jobTitle || "Job Title"}
                        </h3>

                        <p className="rhj_company_name">
                          <FiHome />
                          {companyName}
                        </p>
                      </div>
                    </div>

                    {/* Job Type */}
                    <span className="recent_hot_type_btn">
                      {item?.jobType || "Full Time"}
                    </span>
                  </div>

                  {/* =========================
                      META
                  ========================== */}
                  <div className="recent_hot_meta">
                    <span>
                      <FiMapPin />
                      {location}
                    </span>

                    <span>
                      <FiCalendar />

                      {item?.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </span>
                  </div>

                  {/* =========================
                      BOTTOM
                  ========================== */}
                  <div className="rhj_card_bottom">
                    <div className="rhj_salary">
                      <FiDollarSign />

                      <div>
                        <small>Salary Package</small>

                        <strong>
                          ₹{salary}
                        </strong>
                      </div>
                    </div>

                    <span className="rhj_view_job">
                      View Job
                      <FiArrowRight />
                    </span>
                  </div>
                </article>
              );
            })
          ) : !error ? (
            <div className="rhj_no_results">
              <div className="rhj_no_results_icon">
                <FiSearch />
              </div>

              <h2>No Jobs Found</h2>

              <p>
                No jobs match your current search criteria.
                Try another job title or company name.
              </p>

              <button
                type="button"
                onClick={clearSearch}
              >
                <FiX />
                Clear Search
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}