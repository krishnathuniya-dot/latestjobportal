import React, { useEffect, useMemo, useState } from "react";
import "../css/recenthotjob.css";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaArrowRight,
  FaBuilding,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaRedo,
} from "react-icons/fa";

const API_URL = "https://latestjobportal.onrender.com";

export default function RecenthotsJob() {
  const navigate = useNavigate();

  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  /* =========================================
     FETCH JOBS
  ========================================= */

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/managejob`);
      const data = await response.json();

      console.log("Recent Hot Jobs Response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch jobs"
        );
      }

      const jobs = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.jobs)
        ? data.jobs
        : Array.isArray(data?.job)
        ? data.job
        : [];

      setJobData(jobs);
    } catch (err) {
      console.error("Recent Hot Jobs Error:", err);

      setJobData([]);
      setError(
        err?.message ||
          "Unable to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* =========================================
     SEARCH
  ========================================= */

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return jobData;

    return jobData.filter((item) => {
      const title =
        item?.jobTitle?.toLowerCase() || "";

      const company =
        item?.employerId?.companyName?.toLowerCase() ||
        item?.companyName?.toLowerCase() ||
        "";

      const category =
        item?.category?.toLowerCase() || "";

      const location =
        item?.jobLocation?.toLowerCase() ||
        item?.location?.toLowerCase() ||
        "";

      const jobType =
        item?.jobType?.toLowerCase() || "";

      const skills =
        item?.skillRequired?.toLowerCase() || "";

      return (
        title.includes(query) ||
        company.includes(query) ||
        category.includes(query) ||
        location.includes(query) ||
        jobType.includes(query) ||
        skills.includes(query)
      );
    });
  }, [jobData, search]);

  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages = Math.ceil(
    filteredJobs.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /* =========================================
     HELPERS
  ========================================= */

  const formatDate = (date) => {
    if (!date) return "Recently";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getSalary = (item) => {
    if (item?.salaryPackage) {
      return item.salaryPackage;
    }

    if (item?.salary) {
      return item.salary;
    }

    if (item?.minSalary || item?.maxSalary) {
      return `${item?.minSalary || ""} - ${
        item?.maxSalary || ""
      }`;
    }

    return "Salary not disclosed";
  };

  const getLocation = (item) => {
    return (
      item?.jobLocation ||
      item?.location ||
      "Location not specified"
    );
  };

  const getCompanyName = (item) => {
    return (
      item?.employerId?.companyName ||
      item?.companyName ||
      "Company"
    );
  };

  const getLogo = (item) => {
    const logo =
      item?.employerId?.logo ||
      item?.logo;

    if (!logo) return "";

    if (
      typeof logo === "string" &&
      logo.startsWith("http")
    ) {
      return logo;
    }

    return `${API_URL}/uploads/${logo}`;
  };

  /* =========================================
     RESET SEARCH PAGE
  ========================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* =========================================
     OPEN JOB
  ========================================= */

  const handleJobClick = (jobId) => {
    if (!jobId) return;

    navigate(`/apply/${jobId}`);
  };

  return (
    <section className="recent_hot_jobs_container">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="rhj_header">

        <div className="rhj_header_content">

          <span className="rhj_section_badge">
            <FaBriefcase />
            CAREER OPPORTUNITIES
          </span>

          <h1 className="recent_hot_jobs_heading">
            Recent Hot Jobs
          </h1>

          <p className="rhj_header_description">
            Explore the latest job opportunities
            from trusted companies and find your
            next career move.
          </p>

        </div>

        <button
          type="button"
          className="rhj_refresh_btn"
          onClick={fetchJobs}
          disabled={loading}
        >
          <FaRedo
            className={
              loading
                ? "rhj_refresh_loading"
                : ""
            }
          />

          {loading
            ? "Loading..."
            : "Refresh"}
        </button>

      </div>

      {/* =====================================
          SEARCH
      ===================================== */}

      <div className="rhj_search_wrapper">

        <FaSearch className="rhj_search_icon" />

        <input
          type="text"
          className="rhj_search_input"
          placeholder="Search job title, company, location..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {search && (
          <button
            type="button"
            className="rhj_clear_search"
            onClick={() => setSearch("")}
          >
            ×
          </button>
        )}

      </div>

      {/* =====================================
          RESULT INFO
      ===================================== */}

      {!loading && !error && (
        <div className="rhj_results_info">

          <span>
            <strong>
              {filteredJobs.length}
            </strong>{" "}
            {filteredJobs.length === 1
              ? "job"
              : "jobs"}{" "}
            available
          </span>

          {search && (
            <span>
              Results for{" "}
              <strong>
                "{search}"
              </strong>
            </span>
          )}

        </div>
      )}

      {/* =====================================
          ERROR
      ===================================== */}

      {error && !loading && (
        <div className="rhj_error_box">

          <div className="rhj_error_content">

            <div className="rhj_error_icon">
              !
            </div>

            <div>
              <h3>
                Unable to load jobs
              </h3>

              <p>
                {error}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={fetchJobs}
          >
            <FaRedo />
            Try Again
          </button>

        </div>
      )}

      {/* =====================================
          LOADING
      ===================================== */}

      {loading && (
        <div className="rhj_jobs_list">

          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                className="rhj_skeleton_card"
                key={index}
              >

                <div className="rhj_skeleton_logo" />

                <div className="rhj_skeleton_content">

                  <div className="rhj_skeleton_line title" />

                  <div className="rhj_skeleton_line company" />

                  <div className="rhj_skeleton_line meta" />

                  <div className="rhj_skeleton_line bottom" />

                </div>

              </div>
            )
          )}

        </div>
      )}

      {/* =====================================
          JOB LIST
      ===================================== */}

      {!loading &&
        !error &&
        paginatedJobs.length > 0 && (

          <div className="rhj_jobs_list">

            {paginatedJobs.map((item) => {

              const companyName =
                getCompanyName(item);

              const logo =
                getLogo(item);

              const location =
                getLocation(item);

              return (
                <article
                  key={item?._id}
                  className="recent_hot_job_card"
                  onClick={() =>
                    handleJobClick(item?._id)
                  }
                >

                  {/* LEFT LOGO */}

                  <div className="rhj_logo_container">

                    {logo ? (
                      <img
                        src={logo}
                        alt={companyName}
                        className="recent_hot_logo_img"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          const fallback =
                            e.currentTarget.parentElement?.querySelector(
                              ".recent_hot_logo"
                            );

                          fallback?.classList.add(
                            "rhj_show_logo_fallback"
                          );
                        }}
                      />
                    ) : null}

                    <div
                      className={`recent_hot_logo ${
                        !logo
                          ? "rhj_show_logo_fallback"
                          : ""
                      }`}
                    >
                      {companyName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                  </div>

                  {/* JOB DETAILS */}

                  <div className="rhj_job_content">

                    <div className="rhj_job_top">

                      <div className="rhj_job_heading">

                        <span className="rhj_category">
                          {item?.category ||
                            "Job Opportunity"}
                        </span>

                        <h3>
                          {item?.jobTitle ||
                            "Job Position"}
                        </h3>

                        <p className="rhj_company_name">
                          <FaBuilding />
                          {companyName}
                        </p>

                      </div>

                      <span className="recent_hot_type_btn">
                        {item?.jobType ||
                          "Full Time"}
                      </span>

                    </div>

                    {/* INFO */}

                    <div className="recent_hot_meta">

                      <span>
                        <FaMapMarkerAlt />
                        {location}
                      </span>

                      <span>
                        <FaCalendarAlt />
                        {formatDate(
                          item?.createdAt ||
                            item?.date
                        )}
                      </span>

                      <span className="rhj_salary">
                        <FaRupeeSign />
                        {getSalary(item)}
                      </span>

                    </div>

                    {/* FOOTER */}

                    <div className="rhj_card_action">

                      <span className="rhj_posted_time">
                        <FaClock />
                        Recently Posted
                      </span>

                      <span className="rhj_view_job">
                        View Details
                        <FaArrowRight />
                      </span>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      {/* =====================================
          EMPTY
      ===================================== */}

      {!loading &&
        !error &&
        paginatedJobs.length === 0 && (

          <div className="rhj_empty_state">

            <div className="rhj_empty_icon">
              <FaBriefcase />
            </div>

            <h3>
              No Jobs Found
            </h3>

            <p>
              {search
                ? `No jobs found for "${search}".`
                : "There are currently no job opportunities available."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
              >
                View All Jobs
              </button>
            )}

          </div>
        )}

      {/* =====================================
          PAGINATION
      ===================================== */}

      {!loading &&
        !error &&
        totalPages > 1 && (

          <div className="rhj_pagination">

            <button
              type="button"
              className="rhj_page_btn rhj_arrow_btn"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (prev) => prev - 1
                )
              }
            >
              <FaChevronLeft />
              <span>Prev</span>
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (

              <button
                type="button"
                key={page}
                className={`rhj_page_btn ${
                  currentPage === page
                    ? "rhj_active_page"
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
              type="button"
              className="rhj_page_btn rhj_arrow_btn"
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (prev) => prev + 1
                )
              }
            >
              <span>Next</span>
              <FaChevronRight />
            </button>

          </div>
        )}

    </section>
  );
}