import React, { useEffect, useState } from "react";
import "../css/recenthotjob.css"; // Same CSS dono components ke liye seamlessly kaam karegi
import { useNavigate } from "react-router-dom";

export default function Searchbar() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:2340/api/managejob");
      const data = await response.json();
      const allJobs = Array.isArray(data.data) ? data.data : [];
      setJobs(allJobs);
      setFilteredJobs(allJobs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const searchTitle = jobTitle.trim().toLowerCase();
    const searchCompany = companyName.trim().toLowerCase();

    const result = jobs.filter((job) => {
      const title = job?.jobTitle?.toLowerCase() || "";
      const company = job?.employerId?.companyName?.toLowerCase() || "";

      const titleMatch = !searchTitle || title.includes(searchTitle);
      const companyMatch = !searchCompany || company.includes(searchCompany);

      return titleMatch && companyMatch;
    });

    setFilteredJobs(result);
  };

  return (
    <>
    

  
    <>
      {/* Hero Search Section */}
      <section className="job-search-hero">
        <h1 className="job-search-heading">Find Your Dream Online Job</h1>

        <div className="job-search-container">
          <div className="job-search-field">
            <span className="job-search-icon">💼</span>
            <input
              type="text"
              placeholder="Enter Job Title..."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="job-search-input"
            />
          </div>

          <div className="job-search-field">
            <span className="job-search-icon">🏢</span>
            <input
              type="text"
              placeholder="Enter Company..."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="job-search-input"
            />
          </div>

          <button className="job-search-submit-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </section>

     
    </>
  

      {/* Search Results Display Section */}
      <div className="recent_hot_jobs_container">
        <h2 className="recent_hot_jobs_heading">Search Results</h2>

        {/* 2-Column Grid Setup */}
        <div className="rhj_jobs_grid">
          {loading ? (
            <h2 className="rhj_state_text">Loading jobs...</h2>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((item) => (
              <div
                className="recent_hot_job_card"
                key={item._id}
                onClick={() => navigate(`/apply/${item._id}`)}
              >
                <div className="recent_hot_job_left">
                  {/* Gol Logo Link Area with Click to View Feature */}
                  {item?.employerId?.logo ? (
                    <a
                      href={`http://localhost:2340/uploads/${item.employerId.logo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rhj_logo_link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img
                        src={`http://localhost:2340/uploads/${item.employerId.logo}`}
                        alt={item?.employerId?.companyName}
                        className="recent_hot_logo_img"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </a>
                  ) : (
                    <div className="recent_hot_logo">
                      {item?.employerId?.companyName?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                  )}

                  {/* Job Identity & Details */}
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

                {/* ✅ FIXED: Type Badge ko direct card ka child banaya (pehle left wrapper ke andar band tha) */}
                <button
                  className="recent_hot_type_btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.jobType}
                </button>
              </div>
            ))
          ) : (
            <h2 className="rhj_state_text">No Jobs Match Your Search Criteria</h2>
          )}
        </div>
      </div>
    </>
  );
}