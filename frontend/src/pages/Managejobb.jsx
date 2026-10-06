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

  const storedUser = localStorage.getItem("User");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid User data in localStorage:", error);
  }

  const userId = user?._id || user?.id;

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      if (!userId) {
        setJobData([]);
        setError("Employer login information not found.");
        return;
      }

      const response = await fetch(
        `https://latestjobportal.onrender.com/api/alljobs/${userId}`
      );

      const data = await response.json();

      console.log("Employer Jobs Response =", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to fetch posted jobs."
        );
      }

      setJobData(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);

      setJobData([]);
      setError(
        error.message || "Something went wrong while loading jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [userId]);

  const filteredJobs = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return jobData;
    }

    return jobData.filter((item) => {
      const title = item?.jobTitle?.toLowerCase() || "";
      const location = item?.jobLocation?.toLowerCase() || "";
      const type = item?.jobType?.toLowerCase() || "";
      const company =
        item?.employerId?.companyName?.toLowerCase() || "";

      return (
        title.includes(search) ||
        location.includes(search) ||
        type.includes(search) ||
        company.includes(search)
      );
    });
  }, [jobData, searchText]);

  const formatDate = (date) => {
    if (!date) return "Date not available";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date?.slice(0, 10) || "N/A";
    }
  };

  if (loading) {
    return (
      <div className="manage-jobs-status-page">
        <div className="manage-jobs-loader"></div>
        <h3>Loading Your Jobs...</h3>
        <p>Please wait while we fetch your posted jobs.</p>
      </div>
    );
  }

  return (
    <div className="manage-jobs-page">

      {/* ================= HEADER ================= */}

      <div className="manage-jobs-header">

        <div>
          <span className="manage-jobs-breadcrumb">
            Employer Dashboard / Jobs
          </span>

          <h1>My Posted Jobs</h1>

          <p>
            Manage and view all the jobs you have posted.
          </p>
        </div>

        <div className="manage-jobs-header-icon">
          <FiBriefcase />
        </div>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="manage-jobs-summary">

        <div className="manage-summary-icon">
          <FiBriefcase />
        </div>

        <div>
          <span>Total Posted Jobs</span>
          <strong>{jobData.length}</strong>
        </div>

      </div>

      {/* ================= SEARCH ================= */}

      <div className="manage-jobs-search-section">

        <div className="manage-search-box">
          <FiSearch />

          <input
            type="text"
            placeholder="Search by job title, location, company or type..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {searchText && (
            <button
              type="button"
              className="manage-clear-search"
              onClick={() => setSearchText("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="manage-result-count">
          {filteredJobs.length}{" "}
          {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
        </div>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="manage-jobs-error">
          <FiAlertCircle />

          <div>
            <strong>Unable to load jobs</strong>
            <p>{error}</p>
          </div>

          <button onClick={fetchJobs}>
            <FiRefreshCw />
            Retry
          </button>
        </div>
      )}

      {/* ================= JOB LIST ================= */}

      {!error && filteredJobs.length > 0 ? (
        <div className="manage-jobs-list">

          {filteredJobs.map((item) => (

            <div
              className="manage-job-card"
              key={item._id}
              onClick={() => navigate(`/apply/${item._id}`)}
            >

              {/* Company */}
              <div className="manage-job-company">

                {item?.employerId?.logo ? (
                  <img
                    src={`https://latestjobportal.onrender.com/uploads/${item.employerId.logo}`}
                    alt={
                      item?.employerId?.companyName ||
                      "Company"
                    }
                    className="manage-company-logo"
                  />
                ) : (
                  <div className="manage-default-logo">
                    {item?.employerId?.companyName
                      ?.charAt(0)
                      ?.toUpperCase() || "C"}
                  </div>
                )}

              </div>

              {/* Job Details */}
              <div className="manage-job-details">

                <div className="manage-job-title-row">

                  <div>
                    <h2>{item.jobTitle || "Untitled Job"}</h2>

                    <p className="manage-company-name">
                      {item?.employerId?.companyName ||
                        "Company"}
                    </p>
                  </div>

                  <span className="manage-job-type">
                    {item.jobType || "Job"}
                  </span>

                </div>

                <div className="manage-job-meta">

                  <span>
                    <FiMapPin />
                    {item.jobLocation || "Location not specified"}
                  </span>

                  <span>
                    <FiCalendar />
                    {formatDate(item.createdAt)}
                  </span>

                  <span>
                    <FiDollarSign />
                    ₹{item.salaryPackage || "Not specified"}
                  </span>

                </div>

              </div>

              {/* Arrow */}
              <div className="manage-job-arrow">
                <FiChevronRight />
              </div>

            </div>

          ))}

        </div>
      ) : !error ? (

        <div className="manage-jobs-empty">

          <div className="manage-empty-icon">
            {searchText ? <FiSearch /> : <FiBriefcase />}
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
              onClick={() => setSearchText("")}
              className="manage-reset-btn"
            >
              Clear Search
            </button>
          )}

        </div>

      ) : null}

    </div>
  );
}