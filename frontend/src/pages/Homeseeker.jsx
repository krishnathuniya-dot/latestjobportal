
import { useEffect, useState } from "react";
import "../css/homeseeker.css";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://latestjobportal.onrender.com";

function getFileUrl(file) {
  if (!file) return "";

  // Cloudinary ya kisi aur server ka complete URL
  if (/^https?:\/\//i.test(file)) {
    return file;
  }

  // Purani uploads wali files
  return `${API_URL}/uploads/${String(file).replace(/^\/+/, "")}`;
}

function Homeseeker() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(
          localStorage.getItem("user") || "null"
        );

        if (!storedUser || !(storedUser._id || storedUser.id)) {
          navigate("/login", { replace: true });
          return;
        }

        const userId = storedUser._id || storedUser.id;

        const response = await fetch(
          `${API_URL}/api/profile/${encodeURIComponent(userId)}`
        );

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Profile load nahi ho payi.");
        }

        const profile = data.user || data.data?.user || data.data;

        if (!profile) {
          throw new Error("Profile data nahi mila.");
        }

        if (isMounted) {
          setUser(profile);
          setError("");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);

        if (isMounted) {
          setError(err.message || "Profile load karne mein problem hui.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Kya aap sach mein logout karna chahte hain?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("user");
    localStorage.removeItem("candidateId");
    localStorage.removeItem("userId");

    navigate("/login", { replace: true });
  };

  if (loading) {
    return <h2 className="hs-loading">Loading profile...</h2>;
  }

  if (error) {
    return (
      <div className="hs-profile-container">
        <div className="hs-box">
          <h3>Profile load nahi ho payi</h3>
          <p>{error}</p>

          <button
            className="hs-btn hs-edit-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>

          <button
            className="hs-btn hs-resume-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="hs-profile-container">
      {/* PROFILE CARD */}
      <div className="hs-profile-card">
        <button
          className="hs-logout-btn"
          onClick={handleLogout}
          title="Logout"
          type="button"
        >
          🚪 <span className="hs-logout-text">Logout</span>
        </button>

        <div className="hs-top-section">
          <img
            src={
              getFileUrl(user.profilePic || user.profileImage) ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Profile"
            className="hs-profile-image"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
            }}
          />

          <div className="hs-profile-info">
            <h2 className="hs-user-name">
              {user.fullName || user.name || "Job Seeker"}
            </h2>

            <p className="hs-user-email">
              📧 {user.email || "Email not available"}
            </p>

            <p className="hs-user-phone">
              📞 {user.contactNumber || "Phone not available"}
            </p>

            <div className="hs-btn-group">
              {user.resume && (
                <a
                  href={getFileUrl(user.resume)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hs-btn hs-resume-btn"
                >
                  View Resume
                </a>
              )}

              <Link to="/editprofile" className="hs-btn hs-edit-btn">
                Edit Profile
              </Link>

              <Link to="/education" className="hs-btn hs-education-btn">
                Add Education
              </Link>

              <Link to="/experience" className="hs-btn hs-experience-btn">
                Add Experience
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="hs-box hs-summary-box">
        <h3 className="hs-section-heading">Summary About Me</h3>

        <p className="hs-summary-text">
          {user.summary || "No summary added"}
        </p>
      </div>

      {/* EDUCATION */}
      <div className="hs-box hs-qualification-box">
        <h3 className="hs-section-heading">Qualifications</h3>

        {Array.isArray(user.education) && user.education.length > 0 ? (
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
                  <strong>Year:</strong> {item.year || "Not provided"}
                </p>

                <p className="hs-college-name">
                  <strong>College / School Name:</strong>{" "}
                  {item.college || "Not provided"}
                </p>

                <p className="hs-stream-name">
                  <strong>Stream:</strong> {item.stream || "Not provided"}
                </p>

                <p className="hs-cgpa">
                  <strong>CGPA:</strong> {item.cgpa || "Not provided"}
                </p>

                <p className="hs-percentage">
                  <strong>Percentage:</strong>{" "}
                  {item.percentage || "Not provided"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="hs-empty-text">No qualification added</p>
        )}
      </div>

      {/* EXPERIENCE */}
      <div className="hs-box hs-experience-box">
        <h3 className="hs-section-heading">Work Experience</h3>

        {Array.isArray(user.experience) && user.experience.length > 0 ? (
          user.experience.map((item, index) => (
            <div
              key={item._id || index}
              className="hs-experience-item"
            >
              <h4 className="hs-exp-title">
                {item.employerName || "Employer"}
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
                  <strong>From:</strong> {item.fromDate || "Not provided"}
                </p>

                <p className="hs-to-date">
                  <strong>To:</strong> {item.toDate || "Not provided"}
                </p>

                <p className="hs-ctc">
                  <strong>CTC:</strong> {item.ctc || "Not provided"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="hs-empty-text">No experience added</p>
        )}
      </div>
    </div>
  );
}

export default Homeseeker;
