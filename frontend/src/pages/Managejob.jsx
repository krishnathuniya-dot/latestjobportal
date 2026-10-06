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
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../css/Managejob.css";

export default function Managejob() {
  const [jobData, setJobData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const BASE_URL = "https://latestjobportal.onrender.com";

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BASE_URL}/api/managejob`
      );

      const data = await response.json();

      console.log("API DATA =", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch jobs"
        );
      }

      setJobData(
        Array.isArray(data.data)
          ? data.data
          : []
      );
    } catch (err) {
      console.error("Fetch Jobs Error:", err);

      setJobData([]);

      setError(
        err.message ||
          "Failed to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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
        item?.employerId?.companyName
          ?.toLowerCase() || "";

      return (
        title.includes(search) ||
        category.includes(search) ||
        location.includes(search) ||
        type.includes(search) ||
        company.includes(search)
      );
    });
  }, [jobData, searchText]);

  const formatDate = (date) => {
    if (!date) return "Date not available";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "N/A";
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  return (
    <div className="agagi_jobs_main_container">

      {/* =========================
          HEADER
      ========================== */}

      <div className="agagi_jobs_page_header">

        <div>
          <span className="agagi_jobs_breadcrumb">
            Job Portal / Jobs
          </span>

          <h1 className="agagi_jobs_heading">
            Latest Jobs
          </h1>

          <p className="agagi_jobs_subtitle">
            Find the right opportunity for your career.
          </p>
        </div>

        <div className="agagi_jobs_header_icon">
          <FiBriefcase />
        </div>

      </div>

      {/* =========================
          SEARCH
      ========================== */}

      <div className="agagi_jobs_search_section">

        <div className="agagi_jobs_search_box">
          <FiSearch />

          <input
            type="text"
            placeholder="Search by job title, company, location or category..."
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
              onClick={() =>
                setSearchText("")
              }
            >
              ×
            </button>
          )}
        </div>

        <div className="agagi_jobs_result_count">
          {filteredJobs.length}{" "}
          {filteredJobs.length === 1
            ? "Job"
            : "Jobs"}{" "}
          Found
        </div>

      </div>

      {/* =========================
          SUMMARY
      ========================== */}

      {!loading && !error && (
        <div className="agagi_jobs_summary">
          <div className="agagi_jobs_summary_icon">
            <FiBriefcase />
          </div>

          <div>
            <span>Available Opportunities</span>
            <strong>{jobData.length}</strong>
          </div>
        </div>
      )}

      {/* =========================
          ERROR
      ========================== */}

      {error && !loading && (
        <div className="agagi_jobs_error">

          <FiAlertCircle />

          <div>
            <strong>
              Unable to load jobs
            </strong>

            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={fetchJobs}
          >
            <FiRefreshCw />
            Retry
          </button>

        </div>
      )}

      {/* =========================
          LOADING
      ========================== */}

      {loading ? (
        <div className="agagi_jobs_status">

          <div className="agagi_jobs_loader"></div>

          <h3>Loading Jobs...</h3>

          <p>
            Please wait while we find the latest
            opportunities.
          </p>

        </div>
      ) : error ? null : filteredJobs.length > 0 ? (

        /* =========================
           JOB LIST
        ========================== */

        <div className="agagi_jobs_list">

          {filteredJobs.map((item) => (

            <div
              className="agagi_jobs_card"
              key={item._id}
              onClick={() =>
                handleJobClick(item._id)
              }
            >

              {/* Company Logo */}

              <div className="agagi_jobs_logo_wrapper">

                {item?.employerId?.logo ? (
                  <img
                    src={`${BASE_URL}/uploads/${item.employerId.logo}`}
                    alt={
                      item?.employerId
                        ?.companyName ||
                      "Company"
                    }
                    className="company-logo"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";

                      const parent =
                        e.currentTarget.parentElement;

                      if (parent) {
                        parent.innerHTML = `
                          <div class="default-logo">
                            ${
                              item?.employerId
                                ?.companyName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                              "C"
                            }
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="default-logo">
                    {item?.employerId
                      ?.companyName
                      ?.charAt(0)
                      ?.toUpperCase() || "C"}
                  </div>
                )}

              </div>

              {/* Job Details */}

              <div className="agagi_jobs_details">

                <div className="agagi_jobs_title_row">

                  <div>
                    <h2 className="agagi_jobs_title">
                      {item.jobTitle ||
                        "Untitled Job"}
                    </h2>

                    <p className="agagi_jobs_company">
                      {item?.employerId
                        ?.companyName ||
                        item.category ||
                        "Company"}
                    </p>
                  </div>

                  <span className="agagi_jobs_type_btn">
                    {item.jobType ||
                      "Job"}
                  </span>

                </div>

                {/* Job Meta */}

                <div className="agagi_jobs_info">

                  <span>
                    <FiMapPin />
                    {item.jobLocation ||
                      "Location not specified"}
                  </span>

                  <span>
                    <FiCalendar />
                    {formatDate(
                      item.createdAt
                    )}
                  </span>

                  <span>
                    <FiDollarSign />
                    ₹
                    {item.salaryPackage ||
                      "Not specified"}
                  </span>

                </div>

                {/* Category */}

                {item.category && (
                  <div className="agagi_jobs_category">
                    {item.category}
                  </div>
                )}

              </div>

              {/* Arrow */}

              <div className="agagi_jobs_arrow">
                <FiChevronRight />
              </div>

            </div>

          ))}

        </div>

      ) : (

        /* =========================
           EMPTY STATE
        ========================== */

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
              onClick={() =>
                setSearchText("")
              }
            >
              Clear Search
            </button>
          )}

        </div>
      )}

    </div>
  );
}