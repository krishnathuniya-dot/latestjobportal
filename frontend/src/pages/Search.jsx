
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
const JOBS_PER_PAGE = 6;

export default function Search() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // FETCH JOBS
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/managejob`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Server se valid JSON response nahi mila. API URL check karein."
        );
      }

      const data = await response.json();

      console.log("Jobs Response:", data);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch jobs.");
      }

      const possibleLists = [
        data,
        data?.jobs,
        data?.data,
        data?.job,
        data?.data?.jobs,
        data?.data?.job,
      ];

      const jobList = possibleLists.find(Array.isArray) || [];

      setJobs(jobList);
    } catch (err) {
      console.error("Jobs Error:", err);
      setError(
        err.message || "Unable to load jobs. Please try again."
      );
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // SEARCH
  const filteredJobs = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return jobs;

    return jobs.filter((job) => {
      const employer =
        job?.employerId && typeof job.employerId === "object"
          ? job.employerId
          : {};

      const searchableFields = [
        job?.jobTitle,
        job?.category,
        job?.location,
        job?.jobLocation,
        job?.jobType,
        job?.companyName,
        employer?.companyName,
        job?.salaryPackage,
        job?.experience,
        job?.jobDescription,
        job?.skillRequired,
      ];

      return searchableFields.some((field) => {
        if (Array.isArray(field)) {
          return field.some((item) =>
            String(item).toLowerCase().includes(value)
          );
        }

        return String(field || "").toLowerCase().includes(value);
      });
    });
  }, [jobs, search]);

  // PAGINATION
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const startIndex = (safeCurrentPage - 1) * JOBS_PER_PAGE;

  const currentJobs = filteredJobs.slice(
    startIndex,
    startIndex + JOBS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "Recently Posted";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently Posted";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // SALARY
  const getSalary = (job) => {
    if (job?.salaryPackage) return job.salaryPackage;
    if (job?.salary) return job.salary;

    if (job?.minSalary || job?.maxSalary) {
      return `${job.minSalary || "Not specified"} - ${
        job.maxSalary || "Not specified"
      }`;
    }

    return "Salary not disclosed";
  };

  // COMPANY NAME
  const getCompanyName = (job) => {
    const employer =
      job?.employerId && typeof job.employerId === "object"
        ? job.employerId
        : {};

    return employer?.companyName || job?.companyName || "Company";
  };

  // COMPANY LOGO: CLOUDINARY + OLD UPLOADS
  const getLogo = (job) => {
    const employer =
      job?.employerId && typeof job.employerId === "object"
        ? job.employerId
        : {};

    const logo =
      employer?.logo ||
      job?.companyLogo ||
      job?.logo;

    if (!logo || typeof logo !== "string") return "";

    const cleanLogo = logo.trim();

    if (!cleanLogo) return "";

    // Cloudinary or any complete image URL
    if (/^https?:\/\//i.test(cleanLogo)) {
      return cleanLogo;
    }

    // Legacy local uploads
    return `${API_URL}/uploads/${cleanLogo.replace(/^\/+/, "")}`;
  };

  // OPEN JOB DETAILS
  const openJob = (jobId) => {
    if (!jobId) return;
    navigate(`/apply/${jobId}`);
  };

  return (
    <div className="sj_page">
      {/* TOP BANNER */}
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
            Explore the latest job opportunities from trusted companies
            and apply for the position that matches your skills.
          </p>
        </div>
      </section>

      {/* SEARCH */}
      <section className="sj_search_section">
        <form
          className="sj_search_box"
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
        >
          <FaSearch className="sj_search_icon" />

          <input
            type="text"
            className="sj_search_input"
            placeholder="Search by job title, company, location or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search jobs"
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

          <button type="submit" className="sj_search_button">
            <FaSearch />
            Search
          </button>
        </form>
      </section>

      {/* JOB SECTION */}
      <section className="sj_jobs_section">
        <div className="sj_jobs_heading">
          <div className="sj_heading_content">
            <span className="sj_section_label">
              CAREER OPPORTUNITIES
            </span>

            <h2>Latest Jobs</h2>

            <p>
              {loading
                ? "Finding the latest opportunities..."
                : `${filteredJobs.length} jobs available`}
            </p>
          </div>

          <button
            type="button"
            className="sj_refresh_button"
            onClick={fetchJobs}
            disabled={loading}
          >
            <FaRedo
              className={loading ? "sj_refresh_loading" : ""}
            />
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="sj_error" role="alert">
            <div className="sj_error_content">
              <strong>Unable to load jobs</strong>
              <p>{error}</p>
            </div>

            <button
              type="button"
              className="sj_retry_button"
              onClick={fetchJobs}
              disabled={loading}
            >
              Try Again
            </button>
          </div>
        )}

        {/* LOADING SKELETON */}
        {loading && (
          <div className="sj_jobs_grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                className="sj_job_card sj_skeleton_card"
                key={item}
              >
                <div className="sj_skeleton_top">
                  <div className="sj_skeleton_logo" />
                  <div className="sj_skeleton_type" />
                </div>

                <div className="sj_skeleton_line sj_skeleton_large" />
                <div className="sj_skeleton_line" />
                <div className="sj_skeleton_line sj_skeleton_small" />
                <div className="sj_skeleton_bottom" />
              </div>
            ))}
          </div>
        )}

        {/* NO JOBS */}
        {!loading && !error && currentJobs.length === 0 && (
          <div className="sj_no_jobs">
            <div className="sj_no_jobs_icon">
              <FaBriefcase />
            </div>

            <h3>No Jobs Found</h3>

            <p>
              We couldn't find any jobs matching your search.
            </p>

            {search && (
              <button
                type="button"
                className="sj_view_all_button"
                onClick={() => setSearch("")}
              >
                View All Jobs
              </button>
            )}
          </div>
        )}

        {/* JOB GRID */}
        {!loading && !error && currentJobs.length > 0 && (
          <div className="sj_jobs_grid">
            {currentJobs.map((job, index) => {
              const logo = getLogo(job);
              const companyName = getCompanyName(job);
              const jobId = job?._id;

              return (
                <article
                  className="sj_job_card"
                  key={jobId || `${job?.jobTitle || "job"}-${index}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => openJob(jobId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openJob(jobId);
                    }
                  }}
                >
                  {/* CARD TOP */}
                  <div className="sj_card_top">
                    <div className="sj_company_logo">
                      {logo && (
                        <img
                          src={logo}
                          alt={`${companyName} logo`}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";

                            e.currentTarget.parentElement
                              ?.querySelector(".sj_logo_fallback")
                              ?.classList.add("sj_show_logo_fallback");
                          }}
                        />
                      )}

                      <div
                        className={`sj_logo_fallback ${
                          logo ? "" : "sj_show_logo_fallback"
                        }`}
                      >
                        {companyName.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <span className="sj_job_type">
                      {job?.jobType || "Full Time"}
                    </span>
                  </div>

                  {/* JOB MAIN */}
                  <div className="sj_job_main">
                    <span className="sj_job_category">
                      {job?.category || "Job Opportunity"}
                    </span>

                    <h3>{job?.jobTitle || "Job Position"}</h3>

                    <div className="sj_company_name">
                      <FaBuilding />
                      <span>{companyName}</span>
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
                      <span>{getSalary(job)}</span>
                    </div>

                    <div>
                      <FaCalendarAlt />
                      <span>
                        {formatDate(job?.createdAt || job?.date)}
                      </span>
                    </div>
                  </div>

                  {/* CARD FOOTER */}
                  <div className="sj_card_footer">
                    <span className="sj_posted_time">
                      <FaClock />
                      {job?.createdAt || job?.date
                        ? `Posted ${formatDate(
                            job.createdAt || job.date
                          )}`
                        : "Recently Posted"}
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

        {/* PAGINATION */}
        {!loading && !error && totalPages > 1 && (
          <div className="sj_pagination">
            <button
              type="button"
              className="sj_page_button"
              disabled={safeCurrentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => Math.max(1, prev - 1))
              }
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                type="button"
                key={page}
                className={`sj_page_button ${
                  safeCurrentPage === page ? "sj_active_page" : ""
                }`}
                aria-current={
                  safeCurrentPage === page ? "page" : undefined
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="sj_page_button"
              disabled={safeCurrentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(totalPages, prev + 1)
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
