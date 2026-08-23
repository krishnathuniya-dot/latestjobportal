import React, { useEffect, useState } from "react";
import "../css/recenthotjob.css";

import { useNavigate, useParams } from "react-router-dom";

export default function Categoryjob() {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { category } = useParams();
  const navigate = useNavigate();

  const categoryBanners = {
    IT: {
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1600",
      title: "IT Jobs",
      subtitle: "Build your future with modern technologies",
    },

    Marketing: {
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600",
      title: "Marketing Jobs",
      subtitle: "Grow brands and reach millions",
    },

    Design: {
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600",
      title: "Design Jobs",
      subtitle: "Create beautiful digital experiences",
    },

    Operations: {
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600",
      title: "Operations Jobs",
      subtitle: "Manage business operations efficiently",
    },

    "Product Manager": {
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600",
      title: "Product Manager Jobs",
      subtitle: "Lead products from idea to launch",
    },
  };

  const currentBanner =
    categoryBanners[decodeURIComponent(category)] ||
    categoryBanners.IT;

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `https://latestjobportal-11.onrender.com/api/category/${category}`
      );

      const data = await response.json();

      setJobData(
        Array.isArray(data.jobs)
          ? data.jobs
          : Array.isArray(data.data)
          ? data.data
          : []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category]);

  return (
    <>
      {/* Banner */}
      <div className="category_banner">
        <img
          src={currentBanner.image}
          alt={currentBanner.title}
          className="category_banner_img"
        />

        <div className="category_banner_overlay">
          <h1>{currentBanner.title}</h1>

          <p>{currentBanner.subtitle}</p>
        </div>
      </div>

      <div className="recent_hot_jobs_container">
        <h1 className="recent_hot_jobs_heading">
          {decodeURIComponent(category)} Jobs
        </h1>

        {loading ? (
          <h2>Loading...</h2>
        ) : jobData.length > 0 ? (
          jobData.map((item) => (
            <div
              className="recent_hot_job_card"
              key={item._id}
              onClick={() =>
                navigate(`/apply/${item._id}`)
              }
            >
              <div className="recent_hot_job_left">
                {item?.employerId?.logo ? (
                  <img
                    src={`https://latestjobportal-11.onrender.com/uploads/${item.employerId.logo}`}
                    alt={item?.employerId?.companyName}
                    className="recent_hot_logo_img"
                  />
                ) : (
                  <div className="recent_hot_logo">
                    {item?.employerId?.companyName
                      ?.charAt(0)
                      ?.toUpperCase() || "C"}
                  </div>
                )}

                <div className="recent_hot_content">
                  <h3>{item.jobTitle}</h3>

                  <p>
                    {item?.employerId?.companyName ||
                      item.category}
                  </p>

                  <div className="recent_hot_meta">
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

                  <h4>
                    💰 ₹{item.salaryPackage}
                  </h4>
                </div>
              </div>

              <button
                className="recent_hot_type_btn"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                {item.jobType}
              </button>
            </div>
          ))
        ) : (
          <h2>No Jobs Found</h2>
        )}
      </div>
    </>
  );
}