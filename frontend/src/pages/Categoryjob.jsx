
import React, { useEffect, useState } from "react";


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
    fetchJobs();
  }, [category]);

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  return (
    <div className="cj_page">

      {/* ================= BANNER ================= */}

      <section className="cj_banner">
        <img
          src={currentBanner.image}
          alt={currentBanner.title}
          className="cj_banner_img"
        />

        <div className="cj_banner_overlay">
          <div className="cj_banner_content">

            <span className="cj_banner_badge">
              💼 Career Opportunities
            </span>

            <h1 className="cj_banner_title">
              {currentBanner.title}
            </h1>

            <p className="cj_banner_subtitle">
              {currentBanner.subtitle}
            </p>

            <div className="cj_banner_stats">

              <div className="cj_stat_item">
                <strong>{jobData.length}</strong>
                <span>Available Jobs</span>
              </div>

              <div className="cj_stat_item">
                <strong>100%</strong>
                <span>Career Growth</span>
              </div>

              <div className="cj_stat_item">
                <strong>24/7</strong>
                <span>Job Search</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= JOB SECTION ================= */}

      <section className="cj_jobs_section">

        <div className="cj_jobs_header">

          <div className="cj_heading_content">

            <span className="cj_section_tag">
              🔥 Latest Opportunities
            </span>

            <h2 className="cj_jobs_heading">
              {decodedCategory} Jobs
            </h2>

            <p className="cj_jobs_subtitle">
              Explore the latest{" "}
              {decodedCategory.toLowerCase()} job opportunities
              and take the next step in your career.
            </p>

          </div>

          <div className="cj_job_count">
            <strong>{jobData.length}</strong>
            <span>Jobs Found</span>
          </div>

        </div>

        {/* ================= LOADING ================= */}

        {loading ? (
          <div className="cj_loading">

            <div className="cj_loader"></div>

            <h3>Finding the best jobs...</h3>

            <p>
              Please wait while we load available opportunities.
            </p>

          </div>
        ) : error ? (

          /* ================= ERROR ================= */

          <div className="cj_empty_state">

            <div className="cj_empty_icon">
              ⚠️
            </div>

            <h2>Something went wrong</h2>

            <p>{error}</p>

            <button
              className="cj_retry_btn"
              onClick={fetchJobs}
            >
              Try Again
            </button>

          </div>

        ) : jobData.length > 0 ? (

          /* ================= JOB LIST ================= */

          <div className="cj_jobs_grid">

            {jobData.map((item) => {

              const companyName =
                item?.employerId?.companyName ||
                item?.companyName ||
                item?.category ||
                "Company";

              const companyLogo =
                item?.employerId?.logo || item?.logo;

              return (
                <article
                  className="cj_job_card"
                  key={item?._id}
                  onClick={() => handleApply(item?._id)}
                >

                  {/* CARD TOP */}

                  <div className="cj_card_top">

                    <div className="cj_job_left">

                      {/* LOGO */}

                      <div className="cj_logo_wrapper">

                        {companyLogo ? (
                          <img
                            src={`https://latestjobportal.onrender.com/uploads/${companyLogo}`}
                            alt={companyName}
                            className="cj_logo_img"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";

                              if (
                                e.currentTarget
                                  .nextElementSibling
                              ) {
                                e.currentTarget.nextElementSibling.style.display =
                                  "flex";
                              }
                            }}
                          />
                        ) : null}

                        <div
                          className="cj_logo_fallback"
                          style={{
                            display: companyLogo
                              ? "none"
                              : "flex",
                          }}
                        >
                          {companyName
                            ?.charAt(0)
                            ?.toUpperCase() || "C"}
                        </div>

                      </div>

                      {/* CONTENT */}

                      <div className="cj_job_content">

                        <div className="cj_title_row">

                          <h3 className="cj_job_title">
                            {item?.jobTitle ||
                              "Job Opportunity"}
                          </h3>

                          {item?.isFeatured && (
                            <span className="cj_featured_badge">
                              ⭐ Featured
                            </span>
                          )}

                        </div>

                        <p className="cj_company_name">
                          🏢 {companyName}
                        </p>

                      </div>

                    </div>

                    <span className="cj_job_type">
                      {item?.jobType || "Full Time"}
                    </span>

                  </div>

                  {/* META */}

                  <div className="cj_job_meta">

                    <span>
                      📍{" "}
                      {item?.jobLocation ||
                        "Location not specified"}
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

                  {/* BOTTOM */}

                  <div className="cj_card_bottom">

                    <div className="cj_salary_area">

                      <h4 className="cj_salary">
                        💰 ₹
                        {item?.salaryPackage ||
                          "Not disclosed"}
                      </h4>

                      {item?.category && (
                        <span className="cj_category_badge">
                          {item.category}
                        </span>
                      )}

                    </div>

                    <button
                      className="cj_apply_btn"
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

          <div className="cj_empty_state">

            <div className="cj_empty_icon">
              🔍
            </div>

            <h2>No Jobs Found</h2>

            <p>
              We couldn't find any{" "}
              {decodedCategory.toLowerCase()} jobs
              right now.
            </p>

            <button
              className="cj_browse_btn"
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

