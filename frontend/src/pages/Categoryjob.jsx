import React, { useEffect, useState } from "react";
import "../css/recenthotjob.css";

import { useNavigate, useParams } from "react-router-dom";

export default function Categoryjob() {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { category } = useParams();
  const navigate = useNavigate();

  const decodedCategory = category
    ? decodeURIComponent(category)
    : "IT";

  const categoryBanners = {
    IT: {
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1600&q=85",
      title: "IT Jobs",
      subtitle: "Build your future with modern technologies",
    },

    Marketing: {
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=85",
      title: "Marketing Jobs",
      subtitle: "Grow brands, build strategies and reach millions",
    },

    Design: {
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=85",
      title: "Design Jobs",
      subtitle: "Create beautiful and meaningful digital experiences",
    },

    Operations: {
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=85",
      title: "Operations Jobs",
      subtitle: "Manage teams, processes and business operations",
    },

    "Product Manager": {
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=85",
      title: "Product Manager Jobs",
      subtitle: "Lead products from idea to successful launch",
    },

    "Software Developer": {
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=85",
      title: "Software Developer Jobs",
      subtitle: "Build powerful applications and innovative products",
    },

    "Human Resources": {
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=85",
      title: "Human Resources Jobs",
      subtitle: "Build teams and create a better workplace",
    },

    Finance: {
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&q=85",
      title: "Finance Jobs",
      subtitle: "Build your career in finance and business",
    },
  };

  const currentBanner =
    categoryBanners[decodedCategory] || {
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=85",
      title: `${decodedCategory} Jobs`,
      subtitle: `Find the best ${decodedCategory} opportunities`,
    };

  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://latestjobportal.onrender.com/api/category/${encodeURIComponent(
          decodedCategory
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();

      const jobs = Array.isArray(data?.jobs)
        ? data.jobs
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setJobData(jobs);
    } catch (err) {
      console.error("Category jobs error:", err);
      setError("Unable to load jobs. Please try again.");
      setJobData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      fetchJobs();
    }
  }, [category]);

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  return (
    <div className="category-jobs-page">
      {/* ================= BANNER ================= */}
      <section className="category_banner">
        <img
          src={currentBanner.image}
          alt={currentBanner.title}
          className="category_banner_img"
        />

        <div className="category_banner_overlay">
          <div className="category_banner_content">
            <span className="category_banner_badge">
              💼 Career Opportunities
            </span>

            <h1>{currentBanner.title}</h1>

            <p>{currentBanner.subtitle}</p>

            <div className="category_banner_stats">
              <div>
                <strong>{jobData.length}</strong>
                <span>Available Jobs</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Career Growth</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Job Search</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= JOB SECTION ================= */}
      <section className="recent_hot_jobs_container">
        <div className="category_jobs_header">
          <div>
            <span className="category_section_tag">
              🔥 Latest Opportunities
            </span>

            <h1 className="recent_hot_jobs_heading">
              {decodedCategory} Jobs
            </h1>

            <p className="category_jobs_subtitle">
              Explore the latest {decodedCategory.toLowerCase()} job
              opportunities and take the next step in your career.
            </p>
          </div>

          <div className="category_job_count">
            <strong>{jobData.length}</strong>
            <span>Jobs Found</span>
          </div>
        </div>

        {/* ================= LOADING ================= */}
        {loading ? (
          <div className="category_loading">
            <div className="category_loader"></div>

            <h3>Finding the best jobs...</h3>

            <p>Please wait while we load available opportunities.</p>
          </div>
        ) : error ? (
          /* ================= ERROR ================= */
          <div className="category_empty_state">
            <div className="empty_icon">⚠️</div>

            <h2>Something went wrong</h2>

            <p>{error}</p>

            <button
              className="retry_jobs_btn"
              onClick={fetchJobs}
            >
              Try Again
            </button>
          </div>
        ) : jobData.length > 0 ? (
          /* ================= JOB LIST ================= */
          <div className="category_jobs_list">
            {jobData.map((item) => {
              const companyName =
                item?.employerId?.companyName ||
                item?.companyName ||
                item?.category ||
                "Company";

              const companyLogo = item?.employerId?.logo;

              return (
                <article
                  className="recent_hot_job_card"
                  key={item?._id}
                  onClick={() => handleApply(item?._id)}
                >
                  {/* LEFT */}
                  <div className="recent_hot_job_left">
                    {/* COMPANY LOGO */}
                    <div className="recent_hot_logo_wrapper">
                      {companyLogo ? (
                        <img
                          src={`https://latestjobportal.onrender.com/uploads/${companyLogo}`}
                          alt={companyName}
                          className="recent_hot_logo_img"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling.style.display =
                              "flex";
                          }}
                        />
                      ) : null}

                      <div
                        className="recent_hot_logo"
                        style={{
                          display: companyLogo ? "none" : "flex",
                        }}
                      >
                        {companyName
                          ?.charAt(0)
                          ?.toUpperCase() || "C"}
                      </div>
                    </div>

                    {/* JOB CONTENT */}
                    <div className="recent_hot_content">
                      <div className="job_title_row">
                        <h3>{item?.jobTitle || "Job Opportunity"}</h3>

                        {item?.isFeatured && (
                          <span className="featured_job_badge">
                            ⭐ Featured
                          </span>
                        )}
                      </div>

                      <p className="company_name">
                        🏢 {companyName}
                      </p>

                      <div className="recent_hot_meta">
                        <span>
                          📍 {item?.jobLocation || "Location not specified"}
                        </span>

                        <span>
                          📅{" "}
                          {item?.createdAt
                            ? new Date(
                                item.createdAt
                              ).toLocaleDateString("en-IN")
                            : "N/A"}
                        </span>

                        {item?.experience && (
                          <span>
                            💼 {item.experience}
                          </span>
                        )}
                      </div>

                      <div className="job_bottom_info">
                        <h4>
                          💰 ₹{item?.salaryPackage || "Not disclosed"}
                        </h4>

                        {item?.category && (
                          <span className="job_category_badge">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="recent_hot_job_right">
                    <span className="recent_hot_type_btn">
                      {item?.jobType || "Full Time"}
                    </span>

                    <button
                      className="category_apply_btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(item?._id);
                      }}
                    >
                      Apply Now
                      <span>→</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* ================= EMPTY ================= */
          <div className="category_empty_state">
            <div className="empty_icon">🔍</div>

            <h2>No Jobs Found</h2>

            <p>
              We couldn't find any {decodedCategory.toLowerCase()} jobs
              right now.
            </p>

            <button
              className="browse_all_jobs_btn"
              onClick={() => navigate("/jobs")}
            >
              Browse All Jobs
              <span>→</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}