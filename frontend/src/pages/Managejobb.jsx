
import React, { useEffect, useMemo, useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiChevronRight,
  FiMapPin,
  FiSearch,
  FiDollarSign,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../css/Managejob.css";

const BASE_URL = "https://latestjobportal.onrender.com";

// =========================================
// GET LOGO URL
// Cloudinary + old uploads support
// =========================================

const getLogoUrl = (logo) => {
  if (!logo || typeof logo !== "string") {
    return "";
  }

  const cleanLogo = logo.trim();

  if (!cleanLogo) {
    return "";
  }

  // Cloudinary or another complete URL
  if (/^https?:\/\//i.test(cleanLogo)) {
    return cleanLogo;
  }

  // Old local upload filename
  return `${BASE_URL}/uploads/${cleanLogo.replace(/^\/+/, "")}`;
};

// =========================================
// GET EMPLOYER FROM LOCAL STORAGE
// =========================================

const getStoredEmployer = () => {
  try {
    const storedUser = localStorage.getItem("User");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid employer data:", error);
    return null;
  }
};

// =========================================
// FORMAT DATE
// =========================================

const formatDate = (date) => {
  if (!date) return "Date not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return typeof date === "string"
      ? date.slice(0, 10)
      : "Date not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// =========================================
// COMPANY INITIAL
// =========================================

const getCompanyInitial = (companyName) =>
  companyName?.trim()?.charAt(0)?.toUpperCase() || "C";

// =========================================
// MAIN COMPONENT
// =========================================

export default function Managejobb() {
  const [jobData, setJobData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employerId, setEmployerId] = useState(() => {
    const user = getStoredEmployer();
    return user?._id || user?.id || "";
  });

  const navigate = useNavigate();

  // Keep employer information updated if another tab changes it
  useEffect(() => {
    const syncEmployer = () => {
      const user = getStoredEmployer();
      setEmployerId(user?._id || user?.id || "");
    };

    window.addEventListener("storage", syncEmployer);

    return () => {
      window.removeEventListener("storage", syncEmployer);
    };
  }, []);

  // =========================================
  // FETCH EMPLOYER JOBS
  // =========================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const currentUser = getStoredEmployer();
      const currentEmployerId =
        currentUser?._id || currentUser?.id || employerId;

      if (!currentEmployerId) {
        setJobData([]);
        setError("Employer login information not found. Please log in again.");
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/alljobs/${encodeURIComponent(currentEmployerId)}`
      );

      const data = await response.json();

      console.log("Employer Jobs Response =", data);

      if (!response.ok || data?.success === false) {
        throw new Error(
          data?.message || "Unable to fetch posted jobs."
        );
      }

      let jobs = [];

      if (Array.isArray(data)) {
        jobs = data;
      } else if (Array.isArray(data?.data)) {
        jobs = data.data;
      } else if (Array.isArray(data?.jobs)) {
        jobs = data.jobs;
      } else if (Array.isArray(data?.data?.jobs)) {
        jobs = data.data.jobs;
      }

      setJobData(jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobData([]);
      setError(
        err?.message || "Something went wrong while loading jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // fetch again when employer ID changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employerId]);

  // =========================================
  // SEARCH
  // =========================================

  const filteredJobs = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) return jobData;

    return jobData.filter((item) => {
      const title = String(item?.jobTitle || "").toLowerCase();
      const location = String(item?.jobLocation || "").toLowerCase();
      const type = String(item?.jobType || "").toLowerCase();

      const company = String(
        item?.employerId?.companyName ||
          item?.companyName ||
          ""
      ).toLowerCase();

      const category = String(item?.category || "").toLowerCase();
      const salary = String(item?.salaryPackage || "").toLowerCase();
      const experience = String(item?.experience || "").toLowerCase();

      return (
        title.includes(search) ||
        location.includes(search) ||
        type.includes(search) ||
        company.includes(search) ||
        category.includes(search) ||
        salary.includes(search) ||
        experience.includes(search)
      );
    });
  }, [jobData, searchText]);

  // =========================================
  // JOB CLICK
  // =========================================

  const handleJobClick = (jobId) => {
    if (!jobId) return;
    navigate(`/apply/${jobId}`);
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="mj_status_page">
        <div className="mj_loader"></div>
        <h3>Loading Your Jobs...</h3>
        <p>Please wait while we fetch your posted jobs.</p>
      </div>
    );
  }

  return (
    <div className="mj_page">
      {/* HEADER */}

      <section className="mj_header">
        <div className="mj_header_content">
          <span className="mj_breadcrumb">
            Employer Dashboard / Jobs
          </span>

          <h1>My Posted Jobs</h1>

          <p>Manage and view all the jobs you have posted.</p>
        </div>

        <div className="mj_header_icon">
          <FiBriefcase />
        </div>
      </section>

      {/* SUMMARY */}

      <section className="mj_summary">
        <div className="mj_summary_icon">
          <FiBriefcase />
        </div>

        <div className="mj_summary_content">
          <span>Total Posted Jobs</span>
          <strong>{jobData.length}</strong>
        </div>
      </section>

      {/* SEARCH */}

      <section className="mj_search_section">
        <div className="mj_search_box">
          <FiSearch className="mj_search_icon" />

          <input
            type="text"
            placeholder="Search by job title, location, company or type..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {searchText && (
            <button
              type="button"
              className="mj_clear_search"
              onClick={() => setSearchText("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="mj_search_actions">
          <div className="mj_result_count">
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
          </div>

          <button
            type="button"
            className="mj_retry_button"
            onClick={fetchJobs}
            disabled={loading}
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>
      </section>

      {/* ERROR */}

      {error && (
        <div className="mj_error">
          <div className="mj_error_icon">
            <FiAlertCircle />
          </div>

          <div className="mj_error_content">
            <strong>Unable to load jobs</strong>
            <p>{error}</p>
          </div>

          <button
            type="button"
            className="mj_retry_button"
            onClick={fetchJobs}
          >
            <FiRefreshCw />
            Retry
          </button>
        </div>
      )}

      {/* JOB LIST */}

      {!error && filteredJobs.length > 0 ? (
        <section className="mj_jobs_list">
          {filteredJobs.map((item, index) => {
            const companyName =
              item?.employerId?.companyName ||
              item?.companyName ||
              "Company";

            const companyLogo = getLogoUrl(
              item?.employerId?.logo ||
                item?.companyLogo ||
                item?.logo
            );

            const jobId = item?._id || item?.id;

            return (
              <article
                className="mj_job_card"
                key={jobId || index}
                onClick={() => handleJobClick(jobId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleJobClick(jobId);
                  }
                }}
              >
                {/* COMPANY LOGO */}

                <div className="mj_company">
                  <div className="mj_logo_wrapper">
                    {companyLogo && (
                      <img
                        src={companyLogo}
                        alt={`${companyName} logo`}
                        className="mj_company_logo"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          const fallback =
                            e.currentTarget.parentElement?.querySelector(
                              ".mj_logo_fallback"
                            );

                          fallback?.classList.add(
                            "mj_logo_fallback_show"
                          );
                        }}
                      />
                    )}

                    <div
                      className={`mj_logo_fallback ${
                        companyLogo
                          ? ""
                          : "mj_logo_fallback_show"
                      }`}
                    >
                      {getCompanyInitial(companyName)}
                    </div>
                  </div>
                </div>

                {/* JOB DETAILS */}

                <div className="mj_job_details">
                  <div className="mj_title_row">
                    <div className="mj_title_content">
                      <h2>
                        {item?.jobTitle || "Untitled Job"}
                      </h2>

                      <p className="mj_company_name">
                        {companyName}
                      </p>
                    </div>

                    <span className="mj_job_type">
                      {item?.jobType || "Job"}
                    </span>
                  </div>

                  {/* META */}

                  <div className="mj_job_meta">
                    <span>
                      <FiMapPin />
                      {item?.jobLocation ||
                        "Location not specified"}
                    </span>

                    <span>
                      <FiCalendar />
                      {formatDate(item?.createdAt)}
                    </span>

                    <span>
                      <FiDollarSign />
                      ₹{item?.salaryPackage || "Not specified"}
                    </span>
                  </div>

                  {/* EXTRA INFO */}

                  <div className="mj_extra_info">
                    {item?.category && (
                      <span className="mj_category">
                        {item.category}
                      </span>
                    )}

                    {item?.experience && (
                      <span className="mj_experience">
                        Experience: {item.experience}
                      </span>
                    )}
                  </div>
                </div>

                {/* ARROW */}

                <div className="mj_arrow">
                  <FiChevronRight />
                </div>
              </article>
            );
          })}
        </section>
      ) : !error ? (
        /* EMPTY STATE */

        <section className="mj_empty">
          <div className="mj_empty_icon">
            {searchText ? <FiSearch /> : <FiBriefcase />}
          </div>

          <h2>
            {searchText ? "No Matching Jobs" : "No Jobs Posted Yet"}
          </h2>

          <p>
            {searchText
              ? `No jobs found for "${searchText}". Try another search.`
              : "You haven't posted any jobs yet."}
          </p>

          {searchText && (
            <button
              type="button"
              className="mj_reset_button"
              onClick={() => setSearchText("")}
            >
              Clear Search
            </button>
          )}
        </section>
      ) : null}
    </div>
  );
}
