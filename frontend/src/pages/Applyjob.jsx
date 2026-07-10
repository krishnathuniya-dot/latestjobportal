import React, { useEffect, useState } from "react";
import "../css/applicants.css";
import { useNavigate } from "react-router-dom";

export default function Applyjob() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const candidateId =
        localStorage.getItem("candidateId");

      if (!candidateId) {
        return;   
      }

      const response = await fetch(
        `http://localhost:2340/api/my-applications/${candidateId}`
      );

      const data = await response.json();

      console.log("Applications =", data);

      if (data.success) {
        setApplications(data.data || []);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="applicant-container">
      <h1 className="page-title">
        My Applications
      </h1>

      {applications.length > 0 ? (
        applications.map((item) => (
          <div
            className="applicant-card"
            key={item._id}
          >
            {/* Logo */}
            <div className="company-logo-section">
              {item?.jobId?.employerId?.logo ? (
                <img
                  src={`http://localhost:2340/uploads/${item.jobId.employerId.logo}`}
                  alt={
                    item?.jobId?.employerId
                      ?.companyName
                  }
                  className="company-logo"
                  onError={(e) => {
                    e.target.src =
                      "/default-company.png";
                  }}
                />
              ) : (
                <div className="default-logo">
                  {item?.jobId?.employerId?.companyName
                    ?.charAt(0)
                    ?.toUpperCase() || "C"}
                </div>
              )}
            </div>

            <div className="applicant-content">
              <h2 className="candidate-name">
                {item?.jobId?.jobTitle ||
                  "Job Title"}
              </h2>

              <h3 className="job-title">
                Company:{" "}
                {item?.jobId?.employerId
                  ?.companyName || "N/A"}
              </h3>

              <p className="apply-date">
                Applied Date:{" "}
                {new Date(
                  item.createdAt
                ).toLocaleString()}
              </p>

              {/* Status */}
              <div
                className={`status-badge ${
                  item?.status?.toLowerCase() ||
                  "pending"
                }`}
              >
                Status:{" "}
                {item?.status || "Pending"}
              </div>

              <div className="contact-row">
                <span>
                  📍{" "}
                  {item?.jobId?.jobLocation ||
                    "Location Not Available"}
                </span>

                <span>
                  💰 ₹
                  {item?.jobId
                    ?.salaryPackage ||
                    "Not Mentioned"}
                </span>
              </div>

              <div className="skill-row">
                🔖{" "}
                {item?.jobId?.skillRequired ||
                  "No Skills Mentioned"}
              </div>

              <div className="btn-group">
                <button
                  className="detail-btn"
                  onClick={() =>
                    navigate(
                      `/apply/${item?.jobId?._id}`
                    )
                  }
                >
                  VIEW JOB
                </button>

                <button
                  className="application-btn"
                  onClick={() =>
                    navigate(
                      `/application/${item._id}`
                    )
                  }
                >
                  APPLICATION DETAILS
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h3 style={{ textAlign: "center" }}>
          No Applications Found
        </h3>
      )}
    </div>
  );
}