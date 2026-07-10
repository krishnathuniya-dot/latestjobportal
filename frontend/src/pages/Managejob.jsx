import React, { useEffect, useState } from "react";
import "../css/managejob.css";
import { useNavigate } from "react-router-dom";

export default function Managejob() {
  const [jobData, setJobData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:2340/api/managejob"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();

      console.log("API DATA =", data);

      setJobData(
        Array.isArray(data.data) ? data.data : []
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filterJobs = jobData.filter((item) =>
    item?.jobTitle
      ?.toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <div className="agagi_jobs_main_container">

      {/* Search Section */}
      <div className="agagi_jobs_search_section">
        <input
          type="text"
          placeholder="Enter Job Title"
          className="agagi_jobs_search_input"
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
        />

        <button
          type="button"
          className="agagi_jobs_search_btn"
        >
          🔍
        </button>
      </div>

      {/* Heading */}
      <h1 className="agagi_jobs_heading">
        Latest Jobs
      </h1>

      {/* Error */}
      {error && (
        <h2 className="agagi_jobs_nodata">
          {error}
        </h2>
      )}

      {/* Loading */}
      {loading ? (
        <h2 className="agagi_jobs_nodata">
          Loading Jobs...
        </h2>
      ) : filterJobs.length > 0 ? (
        filterJobs.map((item) => (
          <div
            className="agagi_jobs_card"
            key={item._id}
            onClick={() =>
              navigate(`/apply/${item._id}`)
            }
          >
            <div className="agagi_jobs_left">

              {/* Company Logo */}
              {item?.employerId?.logo ? (
                <img
                  src={`http://localhost:2340/uploads/${item.employerId.logo}`}
                  alt={
                    item?.employerId?.companyName ||
                    "Company Logo"
                  }
                  className="company-logo"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="default-logo">
                  {item?.employerId?.companyName
                    ?.charAt(0)
                    ?.toUpperCase() || "C"}
                </div>
              )}

              <div>
                <h2 className="agagi_jobs_title">
                  {item.jobTitle}
                </h2>

                <p className="agagi_jobs_company">
                  {item.category}
                </p>

                <div className="agagi_jobs_info">
                  <span>
                    📍 {item.jobLocation}
                  </span>

                  <span>
                    📅{" "}
                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "N/A"}
                  </span>
                </div>

                <h3 className="agagi_jobs_salary">
                  💰 ₹{item.salaryPackage}
                </h3>
              </div>
            </div>

            <button
              type="button"
              className="agagi_jobs_type_btn"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              {item.jobType}
            </button>
          </div>
        ))
      ) : (
        <h2 className="agagi_jobs_nodata">
          No Jobs Found
        </h2>
      )}
    </div>
  );
}