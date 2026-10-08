
import React, { useEffect, useState } from "react";
import "../css/applicants.css";
import { useNavigate } from "react-router-dom";

export default function Canditatelist() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const API_URL = "https://latestjobportal.onrender.com";

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      // Employer data
      let storedEmployer = null;

      try {
        storedEmployer = JSON.parse(localStorage.getItem("User"));
      } catch (error) {
        console.log("Invalid employer data in localStorage");
      }

      const employerId = storedEmployer?._id || storedEmployer?.id;

      if (!employerId) {
        alert("Please Login First as an Employer!");
        navigate("/login");
        return;
      }

      // Job ID
      const jobId = localStorage.getItem("jobId");

      if (!jobId) {
        alert("No Job Selected!");
        setApplicants([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/applicants/${jobId}?employerId=${employerId}`
      );

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();

      console.log("Applicants API Response:", data);

      if (data?.success) {
        const applicantData =
          Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.applicants)
            ? data.applicants
            : [];

        setApplicants(applicantData);
      } else {
        setApplicants([]);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="applicants-loading">
        <div className="loading-spinner"></div>
        <h3>Loading Applicants...</h3>
        <p>Please wait...</p>
      </div>
    );
  }

  return (
    <div className="applicant-container">

      {/* Header */}
      <div className="applicant-header">
        <div>
          <h1 className="page-title">Job Applicants</h1>
          <p className="page-subtitle">
            View and manage candidates who applied for this job.
          </p>
        </div>

        <div className="applicant-count">
          {applicants.length}{" "}
          {applicants.length === 1 ? "Applicant" : "Applicants"}
        </div>
      </div>

      {/* Applicants */}
      {applicants.length > 0 ? (
        <div className="applicants-list">

          {applicants.map((item) => {
            const candidate = item?.candidateId || {};
            const job = item?.jobId || {};

            const candidateName =
              candidate.fullName ||
              candidate.name ||
              "Candidate Name";

            const profileImage = candidate.profilePic
              ? `${API_URL}/uploads/${candidate.profilePic}`
              : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

            const resumeUrl = candidate.resume
              ? `${API_URL}/uploads/${candidate.resume}`
              : null;

            return (
              <div className="applicant-card" key={item?._id}>

                {/* Profile Image */}
                <div className="profile-wrapper">
                  <img
                    src={profileImage}
                    alt={candidateName}
                    className="profile-image"
                    onError={(e) => {
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                    }}
                  />
                </div>

                {/* Applicant Content */}
                <div className="applicant-content">

                  {/* Top Section */}
                  <div className="candidate-top">
                    <div>
                      <h2 className="candidate-name">
                        {candidateName}
                      </h2>

                      <p className="candidate-role">
                        Candidate
                      </p>
                    </div>

                    <span className="application-status">
                      Applied
                    </span>
                  </div>

                  {/* Applied Date */}
                  <p className="apply-date">
                    <span>📅</span>
                    Applied Date:{" "}
                    {item?.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "N/A"}
                  </p>

                  {/* Job */}
                  <h3 className="job-title">
                    Applied For:{" "}
                    <span>
                      {job.jobTitle || "Job Title Not Available"}
                    </span>
                  </h3>

                  {/* Contact */}
                  <div className="contact-row">

                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <div>
                        <small>Phone</small>
                        <strong>
                          {candidate.contactNumber ||
                            candidate.mobile ||
                            "N/A"}
                        </strong>
                      </div>
                    </div>

                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      <div>
                        <small>Email</small>
                        <strong>
                          {candidate.email || "N/A"}
                        </strong>
                      </div>
                    </div>

                  </div>

                  {/* Skills */}
                  <div className="skill-row">
                    <span className="skill-icon">🔖</span>

                    <div>
                      <span className="skill-label">
                        Required Skills
                      </span>

                      <p>
                        {job.skillRequired || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="btn-group">

                    {/* Resume */}
                    {resumeUrl ? (
                      <button
                        type="button"
                        className="resume-btn"
                        onClick={() =>
                          window.open(
                            resumeUrl,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        📄 VIEW RESUME
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="resume-btn disabled-btn"
                        disabled
                      >
                        📄 RESUME NOT AVAILABLE
                      </button>
                    )}

                    {/* Candidate Detail */}
                    <button
                      type="button"
                      className="detail-btn"
                      onClick={() =>
                        navigate(`/view/${candidate?._id}`)
                      }
                    >
                      👤 VIEW DETAIL
                    </button>

                    {/* Application Details */}
                    <button
                      type="button"
                      className="application-btn"
                      onClick={() =>
                        navigate(
                          `/applicationdetails/${item?._id}`
                        )
                      }
                    >
                      📋 APPLICATION DETAILS
                    </button>

                  </div>
                </div>
              </div>
            );
          })}

        </div>
      ) : (
        <div className="no-applicants">

          <div className="empty-icon">
            👥
          </div>

          <h3>No Applicants Found</h3>

          <p>
            No applicants have applied for this job post yet.
          </p>

          <button
            type="button"
            className="refresh-btn"
            onClick={fetchApplicants}
          >
            🔄 Refresh
          </button>

        </div>
      )}

    </div>
  );
}

