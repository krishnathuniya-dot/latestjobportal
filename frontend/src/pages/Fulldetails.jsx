import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiCode,
  FiExternalLink,
  FiBriefcase,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import "../css/Fulldetails.css";

const Fulldetails = ({ jobseekerId }) => {
  const { id } = useParams();
  const idToFetch = jobseekerId || id;

  const [seeker, setSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "https://latestjobportal.onrender.com";

  useEffect(() => {
    const fetchJobseekerData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!idToFetch) {
          throw new Error("Jobseeker ID not found.");
        }

        const response = await fetch(
          `${BASE_URL}/api/profile/${idToFetch}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile.");
        }

        setSeeker(data.user);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobseekerData();
  }, [idToFetch]);

  if (loading) {
    return (
      <div className="fd-status-page">
        <div className="fd-loader"></div>
        <h3>Loading Profile...</h3>
        <p>Please wait while we fetch the jobseeker details.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fd-status-page fd-error-page">
        <div className="fd-status-icon error">
          <FiAlertCircle />
        </div>

        <h3>Unable to Load Profile</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!seeker) {
    return (
      <div className="fd-status-page">
        <div className="fd-status-icon">
          <FiUser />
        </div>

        <h3>No Data Found</h3>
        <p>Jobseeker profile information is not available.</p>
      </div>
    );
  }

  const profilePicUrl = seeker.profilePic
    ? `${BASE_URL}/uploads/${seeker.profilePic}`
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const resumeUrl = seeker.resume
    ? `${BASE_URL}/uploads/${seeker.resume}`
    : null;

  const skills = seeker.skills
    ? seeker.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="fd-page">

      {/* Header */}
      <div className="fd-page-header">
        <div>
          <span className="fd-breadcrumb">
            Job Portal / Jobseekers / Profile
          </span>

          <h1>Jobseeker Profile</h1>

          <p>
            View complete professional information and application details.
          </p>
        </div>

        <div className="fd-header-icon">
          <FiBriefcase />
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="fd-profile-card">

        {/* Profile Top */}
        <div className="fd-profile-top">

          <div className="fd-profile-left">
            <img
              src={profilePicUrl}
              alt={seeker.fullName || "Profile"}
              className="fd-profile-image"
            />

            <div className="fd-profile-name">
              <h2>{seeker.fullName || "N/A"}</h2>

              <p>
                <FiBriefcase />
                Job Seeker
              </p>
            </div>
          </div>

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="fd-resume-btn"
            >
              <FiFileText />
              View Resume
              <FiExternalLink />
            </a>
          )}
        </div>

        {/* Basic Information */}
        <div className="fd-section">

          <div className="fd-section-title">
            <div className="fd-title-icon">
              <FiUser />
            </div>

            <div>
              <h3>Basic Information</h3>
              <p>Personal and contact information</p>
            </div>
          </div>

          <div className="fd-info-grid">

            <div className="fd-info-box">
              <div className="fd-info-icon">
                <FiUser />
              </div>

              <div>
                <span>Full Name</span>
                <strong>{seeker.fullName || "N/A"}</strong>
              </div>
            </div>

            <div className="fd-info-box">
              <div className="fd-info-icon">
                <FiMail />
              </div>

              <div>
                <span>Email Address</span>
                <strong>{seeker.email || "N/A"}</strong>
              </div>
            </div>

            <div className="fd-info-box">
              <div className="fd-info-icon">
                <FiPhone />
              </div>

              <div>
                <span>Contact Number</span>
                <strong>
                  {seeker.contactNumber || "N/A"}
                </strong>
              </div>
            </div>

            <div className="fd-info-box">
              <div className="fd-info-icon">
                <FiFileText />
              </div>

              <div>
                <span>Resume</span>

                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="fd-small-resume"
                  >
                    Available
                    <FiExternalLink />
                  </a>
                ) : (
                  <strong>Not Uploaded</strong>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* About */}
        <div className="fd-section">

          <div className="fd-section-title">
            <div className="fd-title-icon">
              <FiFileText />
            </div>

            <div>
              <h3>About Job Seeker</h3>
              <p>Professional summary</p>
            </div>
          </div>

          <div className="fd-summary">
            {seeker.summary ? (
              <p>{seeker.summary}</p>
            ) : (
              <div className="fd-empty-text">
                <FiAlertCircle />
                <span>No summary provided.</span>
              </div>
            )}
          </div>

        </div>

        {/* Skills */}
        <div className="fd-section fd-last-section">

          <div className="fd-section-title">
            <div className="fd-title-icon">
              <FiCode />
            </div>

            <div>
              <h3>Skills & Expertise</h3>
              <p>Technical skills and professional expertise</p>
            </div>
          </div>

          {skills.length > 0 ? (
            <div className="fd-skills">
              {skills.map((skill, index) => (
                <span className="fd-skill" key={index}>
                  <FiCheckCircle />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="fd-empty-text">
              <FiAlertCircle />
              <span>No skills listed.</span>
            </div>
          )}

        </div>
      </div>

      {/* Footer Note */}
      <div className="fd-bottom-note">
        <FiCheckCircle />
        <span>Profile information fetched successfully</span>
      </div>

    </div>
  );
};

export default Fulldetails;