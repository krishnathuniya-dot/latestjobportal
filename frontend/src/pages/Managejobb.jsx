
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

export default function Managejobb() {
  const [jobData, setJobData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================================
  // GET EMPLOYER FROM LOCAL STORAGE
  // =========================================

  const storedUser = localStorage.getItem("User");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Invalid User data in localStorage:",
      error
    );
  }

  const userId = user?._id || user?.id;

  // =========================================
  // FETCH EMPLOYER JOBS
  // =========================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      if (!userId) {
        setJobData([]);
        setError(
          "Employer login information not found."
        );
        return;
      }

      const response = await fetch(
        `https://latestjobportal.onrender.com/api/alljobs/${userId}`
      );

      const data = await response.json();

      console.log(
        "Employer Jobs Response =",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to fetch posted jobs."
        );
      }

      setJobData(
        Array.isArray(data.data)
          ? data.data
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching jobs:",
        error
      );

      setJobData([]);

      setError(
        error.message ||
          "Something went wrong while loading jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [userId]);

  // =========================================
  // SEARCH
  // =========================================

  const filteredJobs = useMemo(() => {
    const search = searchText
      .trim()
      .toLowerCase();

    if (!search) {
      return jobData;
    }

    return jobData.filter((item) => {
      const title =
        item?.jobTitle?.toLowerCase() ||
        "";

      const location =
        item?.jobLocation?.toLowerCase() ||
        "";

      const type =
        item?.jobType?.toLowerCase() ||
        "";

      const company =
        item?.employerId?.companyName?.toLowerCase() ||
        item?.companyName?.toLowerCase() ||
        "";

      const category =
        item?.category?.toLowerCase() ||
        "";

      return (
        title.includes(search) ||
        location.includes(search) ||
        type.includes(search) ||
        company.includes(search) ||
        category.includes(search)
      );
    });
  }, [jobData, searchText]);

  // =========================================
  // DATE FORMAT
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    try {
      const parsedDate = new Date(date);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return (
          date?.slice(0, 10) ||
          "N/A"
        );
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
      return (
        date?.slice(0, 10) ||
        "N/A"
      );
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="mj_status_page">

        <div className="mj_loader"></div>

        <h3>
          Loading Your Jobs...
        </h3>

        <p>
          Please wait while we fetch your
          posted jobs.
        </p>

      </div>
    );
  }

  return (
    <div className="mj_page">

      {/* =========================================
          HEADER
      ========================================= */}

      <section className="mj_header">

        <div className="mj_header_content">

          <span className="mj_breadcrumb">
            Employer Dashboard / Jobs
          </span>

          <h1>
            My Posted Jobs
          </h1>

          <p>
            Manage and view all the jobs
            you have posted.
          </p>

        </div>

        <div className="mj_header_icon">
          <FiBriefcase />
        </div>

      </section>

      {/* =========================================
          SUMMARY
      ========================================= */}

      <section className="mj_summary">

        <div className="mj_summary_icon">
          <FiBriefcase />
        </div>

        <div className="mj_summary_content">

          <span>
            Total Posted Jobs
          </span>

          <strong>
            {jobData.length}
          </strong>

        </div>

      </section>

      {/* =========================================
          SEARCH
      ========================================= */}

      <section className="mj_search_section">

        <div className="mj_search_box">

          <FiSearch className="mj_search_icon" />

          <input
            type="text"
            placeholder="Search by job title, location, company or type..."
            value={searchText}
            onChange={(e) =>
              setSearchText(
                e.target.value
              )
            }
          />

          {searchText && (
            <button
              type="button"
              className="mj_clear_search"
              onClick={() =>
                setSearchText("")
              }
            >
              ×
            </button>
          )}

        </div>

        <div className="mj_result_count">

          {filteredJobs.length}{" "}

          {filteredJobs.length === 1
            ? "Job"
            : "Jobs"}{" "}
          Found

        </div>

      </section>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <div className="mj_error">

          <div className="mj_error_icon">
            <FiAlertCircle />
          </div>

          <div className="mj_error_content">

            <strong>
              Unable to load jobs
            </strong>

            <p>
              {error}
            </p>

          </div>

          <button
            className="mj_retry_button"
            onClick={fetchJobs}
          >
            <FiRefreshCw />
            Retry
          </button>

        </div>
      )}

      {/* =========================================
          JOB LIST
      ========================================= */}

      {!error &&
      filteredJobs.length > 0 ? (

        <section className="mj_jobs_list">

          {filteredJobs.map((item) => {

            const companyName =
              item?.employerId
                ?.companyName ||
              item?.companyName ||
              "Company";

            const companyLogo =
              item?.employerId?.logo ||
              item?.logo;

            return (
              <article
                className="mj_job_card"
                key={item?._id}
                onClick={() =>
                  navigate(
                    `/apply/${item?._id}`
                  )
                }
              >

                {/* COMPANY */}

                <div className="mj_company">

                  <div className="mj_logo_wrapper">

                    {companyLogo ? (
                      <img
                        src={
                          companyLogo.startsWith(
                            "http"
                          )
                            ? companyLogo
                            : `https://latestjobportal.onrender.com/uploads/${companyLogo}`
                        }
                        alt={companyName}
                        className="mj_company_logo"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          e.currentTarget.parentElement
                            ?.querySelector(
                              ".mj_logo_fallback"
                            )
                            ?.classList.add(
                              "mj_logo_fallback_show"
                            );
                        }}
                      />
                    ) : null}

                    <div className="mj_logo_fallback">
                      {companyName
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "C"}
                    </div>

                  </div>

                </div>

                {/* JOB DETAILS */}

                <div className="mj_job_details">

                  <div className="mj_title_row">

                    <div className="mj_title_content">

                      <h2>
                        {item?.jobTitle ||
                          "Untitled Job"}
                      </h2>

                      <p className="mj_company_name">
                        {companyName}
                      </p>

                    </div>

                    <span className="mj_job_type">
                      {item?.jobType ||
                        "Job"}
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

                  {/* EXTRA INFO */}

                  <div className="mj_extra_info">

                    {item?.category && (
                      <span className="mj_category">
                        {item.category}
                      </span>
                    )}

                    {item?.experience && (
                      <span className="mj_experience">
                        Experience:{" "}
                        {item.experience}
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

        /* =========================================
           EMPTY
        ========================================= */

        <section className="mj_empty">

          <div className="mj_empty_icon">

            {searchText ? (
              <FiSearch />
            ) : (
              <FiBriefcase />
            )}

          </div>

          <h2>
            {searchText
              ? "No Matching Jobs"
              : "No Jobs Posted Yet"}
          </h2>

          <p>
            {searchText
              ? `No jobs found for "${searchText}". Try another search.`
              : "You haven't posted any jobs yet."}
          </p>

          {searchText && (
            <button
              className="mj_reset_button"
              onClick={() =>
                setSearchText("")
              }
            >
              Clear Search
            </button>
          )}

        </section>

      ) : null}

    </div>
  );
}

