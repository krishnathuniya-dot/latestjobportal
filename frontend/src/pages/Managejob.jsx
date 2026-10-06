import React, { useEffect, useMemo, useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiChevronRight,
  FiDollarSign,
  FiMapPin,
  FiSearch,
  FiAlertCircle,
  FiRefreshCw,
  FiX,
  FiClock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../css/Managejob.css";

const BASE_URL = "https://latestjobportal.onrender.com";

export default function Managejob() {
  const [jobData, setJobData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================================================
  // FETCH JOBS
  // =========================================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BASE_URL}/api/managejob`
      );

      const data = await response.json();

      console.log("MANAGE JOB API DATA =", data);

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch jobs"
        );
      }

      const jobs = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setJobData(jobs);
    } catch (err) {
      console.error("Fetch Jobs Error:", err);

      setJobData([]);

      setError(
        err?.message ||
          "Failed to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredJobs = useMemo(() => {
    const search = searchText
      .trim()
      .toLowerCase();

    if (!search) {
      return jobData;
    }

    return jobData.filter((item) => {
      const title =
        item?.jobTitle?.toLowerCase() || "";

      const category =
        item?.category?.toLowerCase() || "";

      const location =
        item?.jobLocation?.toLowerCase() || "";

      const type =
        item?.jobType?.toLowerCase() || "";

      const company =
        item?.employerId?.companyName?.toLowerCase() ||
        "";

      const salary =
        String(item?.salaryPackage || "").toLowerCase();

      return (
        title.includes(search) ||
        category.includes(search) ||
        location.includes(search) ||
        type.includes(search) ||
        company.includes(search) ||
        salary.includes(search)
      );
    });
  }, [jobData, searchText]);

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    try {
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
    } catch {
      return "Date not available";
    }
  };

  // =========================================================
  // JOB CLICK
  // =========================================================

  const handleJobClick = (jobId) => {
    if (!jobId) return;

    navigate(`/apply/${jobId}`);
  };

  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const clearSearch = () => {
    setSearchText("");
  };

  // =========================================================
  // COMPANY INITIAL
  // =========================================================

  const getCompanyInitial = (companyName) => {
    return (
      companyName?.charAt(0)?.toUpperCase() || "C"
    );
  };

  return (
    <div className="agagi_jobs_main_container">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="agagi_jobs_page_header">

        <div className="agagi_jobs_header_content">

          <span className="agagi_jobs_breadcrumb">
            Job Portal
            <span>/</span>
            Jobs
          </span>

          <h1 className="agagi_jobs_heading">
            Find Your Next Job
          </h1>

          <p className="agagi_jobs_subtitle">
            Discover the latest job opportunities
            and take the next step in your career.
          </p>

        </div>

        <div className="agagi_jobs_header_icon">
          <FiBriefcase />
        </div>

      </section>

      {/* =====================================================
          SEARCH SECTION
      ===================================================== */}

      <section className="agagi_jobs_search_section">

        <div className="agagi_jobs_search_box">

          <FiSearch className="agagi_jobs_search_icon" />

          <input
            type="text"
            placeholder="Search job title, company, location or category..."
            className="agagi_jobs_search_input"
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
          />

          {searchText && (
            <button
              type="button"
              className="agagi_jobs_clear_btn"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}

        </div>

        <div className="agagi_jobs_search_bottom">

          <div className="agagi_jobs_result_count">
            <strong>
              {filteredJobs.length}
            </strong>

            <span>
              {filteredJobs.length === 1
                ? "Job"
                : "Jobs"}{" "}
              Found
            </span>
          </div>

          {!loading && !error && (
            <button
              type="button"
              className="agagi_jobs_refresh_btn"
              onClick={fetchJobs}
              title="Refresh jobs"
            >
              <FiRefreshCw />
              Refresh
            </button>
          )}

        </div>

      </section>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      {!loading && !error && (
        <div className="agagi_jobs_summary">

          <div className="agagi_jobs_summary_icon">
            <FiBriefcase />
          </div>

          <div className="agagi_jobs_summary_content">
            <span>
              Available Opportunities
            </span>

            <strong>
              {jobData.length}
            </strong>
          </div>

          <div className="agagi_jobs_summary_right">
            <span>
              Updated jobs
            </span>
          </div>

        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && !loading && (
        <div className="agagi_jobs_error">

          <div className="agagi_jobs_error_icon">
            <FiAlertCircle />
          </div>

          <div className="agagi_jobs_error_content">

            <strong>
              Unable to load jobs
            </strong>

            <p>
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={fetchJobs}
            className="agagi_jobs_retry_btn"
          >
            <FiRefreshCw />
            Retry
          </button>

        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div className="agagi_jobs_status">

          <div className="agagi_jobs_loader"></div>

          <h3>
            Loading Jobs...
          </h3>

          <p>
            Please wait while we find the latest
            opportunities for you.
          </p>

        </div>
      ) : error ? null : filteredJobs.length > 0 ? (

        /* ===================================================
           JOB LIST
        =================================================== */

        <div className="agagi_jobs_list">

          {filteredJobs.map((item) => {

            const companyName =
              item?.employerId?.companyName ||
              item?.category ||
              "Company";

            const companyLogo =
              item?.employerId?.logo
                ? `${BASE_URL}/uploads/${item.employerId.logo}`
                : null;

            return (
              <article
                className="agagi_jobs_card"
                key={item?._id}
                onClick={() =>
                  handleJobClick(item?._id)
                }
              >

                {/* =========================================
                    COMPANY LOGO
                ========================================== */}

                <div className="agagi_jobs_logo_wrapper">

                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="company-logo"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";

                        const fallback =
                          e.currentTarget.parentElement?.querySelector(
                            ".default-logo"
                          );

                        if (fallback) {
                          fallback.style.display =
                            "flex";
                        }
                      }}
                    />
                  ) : null}

                  <div
                    className="default-logo"
                    style={{
                      display: companyLogo
                        ? "none"
                        : "flex",
                    }}
                  >
                    {getCompanyInitial(
                      companyName
                    )}
                  </div>

                </div>

                {/* =========================================
                    JOB DETAILS
                ========================================== */}

                <div className="agagi_jobs_details">

                  <div className="agagi_jobs_title_row">

                    <div className="agagi_jobs_title_content">

                      <h2 className="agagi_jobs_title">
                        {item?.jobTitle ||
                          "Untitled Job"}
                      </h2>

                      <p className="agagi_jobs_company">
                        {companyName}
                      </p>

                    </div>

                    <span className="agagi_jobs_type_btn">
                      {item?.jobType || "Job"}
                    </span>

                  </div>

                  {/* =====================================
                      JOB META
                  ====================================== */}

                  <div className="agagi_jobs_info">

                    <span>
                      <FiMapPin />
                      {item?.jobLocation ||
                        "Location not specified"}
                    </span>

                    <span>
                      <FiCalendar />
                      {formatDate(
                        item?.createdAt
                      )}
                    </span>

                    <span>
                      <FiDollarSign />
                      ₹
                      {item?.salaryPackage ||
                        "Not specified"}
                    </span>

                  </div>

                  {/* =====================================
                      CATEGORY
                  ====================================== */}

                  <div className="agagi_jobs_bottom_row">

                    {item?.category && (
                      <span className="agagi_jobs_category">
                        {item.category}
                      </span>
                    )}

                    <span className="agagi_jobs_view_text">
                      View Job
                      <FiChevronRight />
                    </span>

                  </div>

                </div>

                {/* =========================================
                    ARROW
                ========================================== */}

                <div className="agagi_jobs_arrow">
                  <FiChevronRight />
                </div>

              </article>
            );
          })}

        </div>

      ) : (

        /* ===================================================
           EMPTY STATE
        =================================================== */

        <div className="agagi_jobs_empty">

          <div className="agagi_jobs_empty_icon">

            {searchText ? (
              <FiSearch />
            ) : (
              <FiBriefcase />
            )}

          </div>

          <h2>
            {searchText
              ? "No Jobs Found"
              : "No Jobs Available"}
          </h2>

          <p>
            {searchText
              ? `We couldn't find any jobs matching "${searchText}".`
              : "There are currently no job opportunities available."}
          </p>

          {searchText && (
            <button
              type="button"
              onClick={clearSearch}
            >
              Clear Search
            </button>
          )}

        </div>
      )}

    </div>
  );
}