import React, { useEffect, useState } from "react";
import "../css/recenthotjob.css";
import { useNavigate } from "react-router-dom";

export default function RecenthotsJob() {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Grid layout ke liye even number (6) rakha hai taaki rows barabar dikhein

  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const response = await fetch("https://latestjobportal-11.onrender.com/api/managejob");
      const data = await response.json();
      setJobData(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Search filter
  const filteredJobs = jobData.filter((item) => {
    const query = search.toLowerCase();
    return (
      item?.jobTitle?.toLowerCase().includes(query) ||
      item?.employerId?.companyName?.toLowerCase().includes(query)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="recent_hot_jobs_container">
      <h1 className="recent_hot_jobs_heading">Recent Hot Jobs</h1>

      {/* Search Bar */}
      <div className="rhj_search_wrapper">
        <input
          type="text"
          placeholder="🔍 Search Job Title or Company Name"
          className="rhj_search_input"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset page on search
          }}
        />
      </div>

      {/* Jobs Grid Container */}
      <div className="rhj_jobs_grid">
        {loading ? (
          <h2 className="rhj_state_text">Loading jobs...</h2>
        ) : paginatedJobs.length > 0 ? (
          paginatedJobs.map((item) => (
            <div
              className="recent_hot_job_card"
              key={item._id}
              onClick={() => navigate(`/apply/${item._id}`)}
            >
              <div className="recent_hot_job_left">
                {/* Logo Section with Click-to-View Feature */}
                {item?.employerId?.logo ? (
                  <a
                    href={`https://latestjobportal-11.onrender.com/uploads/${item.employerId.logo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rhj_logo_link"
                    onClick={(e) => e.stopPropagation()} /* Card redirection ko rokne ke liye */
                  >
                    <img
                      src={`https://latestjobportal-11.onrender.com/uploads/${item.employerId.logo}`}
                      alt={item?.employerId?.companyName}
                      className="recent_hot_logo_img"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </a>
                ) : (
                  <div className="recent_hot_logo">
                    {item?.employerId?.companyName?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                )}

                {/* Text Content */}
                <div className="recent_hot_content">
                  <h3>{item.jobTitle}</h3>
                  <p>{item?.employerId?.companyName || item.category}</p>

                  <div className="recent_hot_meta">
                    <span>📍 {item.jobLocation}</span>
                    <span>
                      📅{" "}
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </span>
                  </div>

                  <h4>💰 ₹{item.salaryPackage}</h4>
                </div>
              </div>

              {/* Job Type Badge */}
              <button
                className="recent_hot_type_btn"
                onClick={(e) => e.stopPropagation()}
              >
                {item.jobType}
              </button>
            </div>
          ))
        ) : (
          <h2 className="rhj_state_text">No Jobs Found</h2>
        )}
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="rhj_pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="rhj_page_btn"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`rhj_page_btn ${
                currentPage === index + 1 ? "rhj_active_page" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="rhj_page_btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}