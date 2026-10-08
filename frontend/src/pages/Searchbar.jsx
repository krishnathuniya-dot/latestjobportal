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
        !searchCompany || company.includes(searchCompany);

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
        ".sb_fallback_logo"
      );

    if (fallback) {
      fallback.style.display = "flex";
    }
  };

  return (
    <div className="sb_search_page">
      {/* =================================
          HERO SEARCH SECTION
      ================================= */}
      <section className="sb_search_hero">
        <div className="sb_search_hero_content">
          <span className="sb_search_eyebrow">
            <FiBriefcase />
            FIND YOUR NEXT OPPORTUNITY
          </span>

          <h1 className="sb_search_heading">
            Find Your Dream Job
          </h1>

          <p className="sb_search_description">
            Search thousands of opportunities and find the right job
            for your career.
          </p>

          <div className="sb_search_container">
            {/* Job Title */}
            <div className="sb_search_field">
              <FiSearch className="sb_search_field_icon" />

              <div className="sb_search_input_content">
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
                  className="sb_search_clear_btn"
                  onClick={() => setJobTitle("")}
                  aria-label="Clear job title"
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* Company */}
            <div className="sb_search_field">
              <FiHome className="sb_search_field_icon" />

              <div className="sb_search_input_content">
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
                  className="sb_search_clear_btn"
                  onClick={() => setCompanyName("")}
                  aria-label="Clear company"
                >
                  <FiX />
                </button>
              )}
            </div>

            <button
              type="button"
              className="sb_search_submit_btn"
              onClick={() => {
                // Search is already reactive.
              }}
            >
              <FiSearch />
              Search Jobs
            </button>
          </div>

          {(jobTitle || companyName) && (
            <button
              type="button"
              className="sb_clear_all_search"
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
      <section className="sb_results_container">
        <div className="sb_results_header">
          <div>
            <span className="sb_results_label">
              JOB OPPORTUNITIES
            </span>

            <h2 className="sb_results_heading">
              Search Results
            </h2>

            {!loading && !error && (
              <p className="sb_results_count">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} found
              </p>
            )}
          </div>

          <button
            type="button"
            className="sb_refresh_btn"
            onClick={fetchJobs}
            disabled={loading}
          >
            <FiRefreshCw
              className={loading ? "sb_refresh_spinning" : ""}
            />
            Refresh
          </button>
        </div>

        {/* =================================
            ERROR
        ================================= */}
        {error && (
          <div className="sb_error_state">
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
        <div className="sb_jobs_grid">
          {loading ? (
            <>
              <div className="sb_loading_card">
                <div className="sb_skeleton_logo"></div>

                <div className="sb_skeleton_content">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="sb_loading_card">
                <div className="sb_skeleton_logo"></div>

                <div className="sb_skeleton_content">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="sb_loading_card">
                <div className="sb_skeleton_logo"></div>

                <div className="sb_skeleton_content">
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
                  className="sb_job_card"
                  key={item?._id}
                  onClick={() =>
                    navigate(`/apply/${item?._id}`)
                  }
                >
                  {/* =========================
                      CARD TOP
                  ========================== */}
                  <div className="sb_card_top">
                    <div className="sb_job_left">
                      {/* Logo */}
                      <div className="sb_logo_wrapper">
                        {logo ? (
                          <img
                            src={logo}
                            alt={companyName}
                            className="sb_logo_img"
                            onError={handleLogoError}
                          />
                        ) : null}

                        <div
                          className="sb_fallback_logo"
                          style={{
                            display: logo ? "none" : "flex",
                          }}
                        >
                          {companyInitial}
                        </div>
                      </div>

                      {/* Job Content */}
                      <div className="sb_job_content">
                        <span className="sb_job_category">
                          <FiBriefcase />
                          {item?.category ||
                            "Job Opportunity"}
                        </span>

                        <h3>
                          {item?.jobTitle || "Job Title"}
                        </h3>

                        <p className="sb_company_name">
                          <FiHome />
                          {companyName}
                        </p>
                      </div>
                    </div>

                    {/* Job Type */}
                    <span className="sb_job_type">
                      {item?.jobType || "Full Time"}
                    </span>
                  </div>

                  {/* =========================
                      META
                  ========================== */}
                  <div className="sb_job_meta">
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
                  <div className="sb_card_bottom">
                    <div className="sb_salary">
                      <FiDollarSign />

                      <div>
                        <small>Salary Package</small>

                        <strong>
                          ₹{salary}
                        </strong>
                      </div>
                    </div>

                    <span className="sb_view_job">
                      View Job
                      <FiArrowRight />
                    </span>
                  </div>
                </article>
              );
            })
          ) : !error ? (
            <div className="sb_no_results">
              <div className="sb_no_results_icon">
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