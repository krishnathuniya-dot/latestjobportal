
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

      const jobList = Array.isArray(data)
        ? data
        : Array.isArray(data?.jobs)
        ? data.jobs
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.job)
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
        job?.location?.toLowerCase() ||
        job?.jobLocation?.toLowerCase() ||
        "";

      const jobType =
        job?.jobType?.toLowerCase() || "";

      const company =
        job?.employerId?.companyName?.toLowerCase() ||
        job?.companyName?.toLowerCase() ||
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
    if (!date) {
      return "Recently Posted";
    }

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
    if (job?.salaryPackage) {
      return job.salaryPackage;
    }

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
    <div className="sj_page">

      {/* =========================================
          TOP BANNER
      ========================================= */}

      <section className="sj_banner">

        <div className="sj_banner_content">

          <span className="sj_banner_tag">
            <FaBriefcase />
            EMPLOYER JOBS
          </span>

          <h1 className="sj_banner_title">
            Find Your Next
            <span> Career Opportunity</span>
          </h1>

          <p className="sj_banner_description">
            Explore the latest job opportunities
            from trusted companies and apply for
            the position that matches your skills.
          </p>

        </div>

      </section>

      {/* =========================================
          SEARCH
      ========================================= */}

      <section className="sj_search_section">

        <div className="sj_search_box">

          <FaSearch className="sj_search_icon" />

          <input
            type="text"
            className="sj_search_input"
            placeholder="Search by job title, company, location or category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="sj_clear_search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

          <button
            type="button"
            className="sj_search_button"
          >
            <FaSearch />
            Search
          </button>

        </div>

      </section>

      {/* =========================================
          JOB SECTION
      ========================================= */}

      <section className="sj_jobs_section">

        <div className="sj_jobs_heading">

          <div className="sj_heading_content">

            <span className="sj_section_label">
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
            className="sj_refresh_button"
            onClick={fetchJobs}
            disabled={loading}
          >
            <FaRedo
              className={
                loading
                  ? "sj_refresh_loading"
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
          <div className="sj_error">

            <div className="sj_error_content">

              <strong>
                Unable to load jobs
              </strong>

              <p>{error}</p>

            </div>

            <button
              className="sj_retry_button"
              onClick={fetchJobs}
            >
              Try Again
            </button>

          </div>
        )}

        {/* =========================================
            LOADING
        ========================================= */}

        {loading && (
          <div className="sj_jobs_grid">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  className="sj_job_card sj_skeleton_card"
                  key={item}
                >

                  <div className="sj_skeleton_top">

                    <div className="sj_skeleton_logo"></div>

                    <div className="sj_skeleton_type"></div>

                  </div>

                  <div className="sj_skeleton_line sj_skeleton_large"></div>

                  <div className="sj_skeleton_line"></div>

                  <div className="sj_skeleton_line sj_skeleton_small"></div>

                  <div className="sj_skeleton_bottom"></div>

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
            <div className="sj_no_jobs">

              <div className="sj_no_jobs_icon">
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
                  className="sj_view_all_button"
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
            <div className="sj_jobs_grid">

              {currentJobs.map((job) => {

                const logo = getLogo(job);

                const companyName =
                  job?.employerId?.companyName ||
                  job?.companyName ||
                  "Company";

                return (
                  <article
                    className="sj_job_card"
                    key={job?._id}
                    onClick={() =>
                      navigate(
                        `/apply/${job?._id}`
                      )
                    }
                  >

                    {/* CARD TOP */}

                    <div className="sj_card_top">

                      <div className="sj_company_logo">

                        {logo ? (
                          <img
                            src={logo}
                            alt={companyName}
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";

                              e.currentTarget.parentElement
                                .querySelector(
                                  ".sj_logo_fallback"
                                )
                                ?.classList.add(
                                  "sj_show_logo_fallback"
                                );
                            }}
                          />
                        ) : null}

                        <div className="sj_logo_fallback">
                          {companyName
                            ?.charAt(0)
                            ?.toUpperCase() || "C"}
                        </div>

                      </div>

                      <span className="sj_job_type">
                        {job?.jobType ||
                          "Full Time"}
                      </span>

                    </div>

                    {/* JOB MAIN */}

                    <div className="sj_job_main">

                      <span className="sj_job_category">
                        {job?.category ||
                          "Job Opportunity"}
                      </span>

                      <h3>
                        {job?.jobTitle ||
                          "Job Position"}
                      </h3>

                      <div className="sj_company_name">

                        <FaBuilding />

                        <span>
                          {companyName}
                        </span>

                      </div>

                    </div>

                    {/* JOB DETAILS */}

                    <div className="sj_job_details">

                      <div>
                        <FaMapMarkerAlt />

                        <span>
                          {job?.location ||
                            job?.jobLocation ||
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

                    {/* CARD FOOTER */}

                    <div className="sj_card_footer">

                      <span className="sj_posted_time">
                        <FaClock />
                        Recently Posted
                      </span>

                      <span className="sj_view_job">
                        View Job
                        <FaArrowRight />
                      </span>

                    </div>

                  </article>
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
            <div className="sj_pagination">

              <button
                className="sj_page_button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    (prev) => prev - 1
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
                  className={`sj_page_button ${
                    currentPage === page
                      ? "sj_active_page"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page}
                </button>
              ))}

              <button
                className="sj_page_button"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) => prev + 1
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

