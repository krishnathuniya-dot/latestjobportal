
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/homeseeker.css";

const API_URL = "https://latestjobportal.onrender.com";

const DEFAULT_PROFILE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

// Cloudinary URL aur purane uploads filenames dono support
const getFileUrl = (file) => {
  if (!file || typeof file !== "string") {
    return "";
  }

  const cleanFile = file.trim();

  if (!cleanFile) {
    return "";
  }

  if (/^https?:\/\//i.test(cleanFile)) {
    return cleanFile;
  }

  return `${API_URL}/uploads/${cleanFile.replace(/^\/+/, "")}`;
};

function View() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    if (!id) {
      setError("Profile ID nahi mila.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/profile/${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Server se valid response nahi mila. API URL check karein."
        );
      }

      const data = await response.json();

      console.log("Profile Response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || "Profile load nahi ho payi."
        );
      }

      const profile =
        data?.user ||
        data?.data?.user ||
        data?.data;

      if (
        data?.success === false ||
        !profile ||
        typeof profile !== "object"
      ) {
        throw new Error(
          data?.message || "User profile nahi mili."
        );
      }

      setUser(profile);
    } catch (err) {
      console.error("Profile Error:", err);
      setError(
        err.message || "Profile load karne mein problem hui."
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="hs-profile-container">
        <div className="hs-box">
          <h2>Loading profile...</h2>
          <p>Please wait while profile details load ho rahi hain.</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="hs-profile-container">
        <div className="hs-box">
          <h2>Profile Load Nahi Hui</h2>
          <p>{error || "User profile nahi mili."}</p>

          <button
            type="button"
            className="hs-btn hs-resume-btn"
            onClick={fetchProfile}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const profileImage = getFileUrl(
    user.profilePic || user.profileImage
  );

  const resumeUrl = getFileUrl(user.resume);

  return (
    <div className="hs-profile-container">
      {/* PROFILE CARD */}
      <div className="hs-profile-card">
        <div className="hs-top-section">
          <img
            src={profileImage || DEFAULT_PROFILE}
            alt={`${user.fullName || "User"} profile`}
            className="hs-profile-image"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_PROFILE;
            }}
          />

          <div className="hs-profile-info">
            <h2 className="hs-user-name">
              {user.fullName || "Name not provided"}
            </h2>

            <p className="hs-user-email">
              <span>📧</span>{" "}
              {user.email || "Email not provided"}
            </p>

            <p className="hs-user-phone">
              <span>📞</span>{" "}
              {user.contactNumber || "Contact not provided"}
            </p>

            <div className="hs-btn-group">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hs-btn hs-resume-btn"
                >
                  View Resume
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="hs-box hs-summary-box">
        <h3 className="hs-section-heading">
          Summary About Me
        </h3>

        <p className="hs-summary-text">
          {user.summary || "No summary added"}
        </p>
      </div>

      {/* EDUCATION */}
      <div className="hs-box hs-qualification-box">
        <h3 className="hs-section-heading">
          Qualifications
        </h3>

        {Array.isArray(user.education) &&
        user.education.length > 0 ? (
          user.education.map((item, index) => (
            <div
              key={item._id || index}
              className="hs-education-item"
            >
              <h4 className="hs-edu-title">
                {item.qualification || "Qualification"}
              </h4>

              <div className="hs-edu-content">
                <p className="hs-edu-year">
                  {item.year || "Year not provided"}
                </p>

                <p className="hs-college-name">
                  <strong>College / School Name:</strong>{" "}
                  {item.college || "Not provided"}
                </p>

                <p className="hs-stream-name">
                  <strong>Stream:</strong>{" "}
                  {item.stream || "Not provided"}
                </p>

                <p className="hs-cgpa">
                  <strong>CGPA:</strong>{" "}
                  {item.cgpa || "Not provided"}
                </p>

                <p className="hs-percentage">
                  <strong>Percentage:</strong>{" "}
                  {item.percentage || "Not provided"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="hs-empty-text">
            No qualification added
          </p>
        )}
      </div>

      {/* EXPERIENCE */}
      <div className="hs-box hs-experience-box">
        <h3 className="hs-section-heading">
          Work Experience
        </h3>

        {Array.isArray(user.experience) &&
        user.experience.length > 0 ? (
          user.experience.map((item, index) => (
            <div
              key={item._id || index}
              className="hs-experience-item"
            >
              <h4 className="hs-exp-title">
                {item.employerName || "Employer not provided"}
              </h4>

              <div className="hs-exp-content">
                <p className="hs-employment-type">
                  <strong>Employment Type:</strong>{" "}
                  {item.employmentType || "Not provided"}
                </p>

                <p className="hs-designation">
                  <strong>Designation:</strong>{" "}
                  {item.designation || "Not provided"}
                </p>

                <p className="hs-from-date">
                  <strong>From:</strong>{" "}
                  {item.fromDate || "Not provided"}
                </p>

                <p className="hs-to-date">
                  <strong>To:</strong>{" "}
                  {item.toDate || "Not provided"}
                </p>

                <p className="hs-ctc">
                  <strong>CTC:</strong>{" "}
                  {item.ctc || "Not provided"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="hs-empty-text">
            No experience added
          </p>
        )}
      </div>
    </div>
  );
}

export default View;
