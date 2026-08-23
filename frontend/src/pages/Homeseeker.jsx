import { useEffect, useState } from "react";
import "../css/homeseeker.css";
import { Link, useNavigate } from "react-router-dom"; // useNavigate को इम्पोर्ट किया

function Homeseeker() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // नेविगेट करने के लिए हुक

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login"); // अगर यूजर नहीं है तो सीधे लॉगिन पर भेजें
      return;
    }

    fetch(`https://latestjobportal-11.onrender.com/api/profile/${storedUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  // लॉगआउट फंक्शन जो असल में काम करेगा
  const handleLogout = () => {
    const confirmLogout = window.confirm("क्या आप सच में लॉगआउट करना चाहते हैं?");
    if (confirmLogout) {
      localStorage.removeItem("user"); // LocalStorage से यूजर का डेटा डिलीट किया
      navigate("/login"); // यूजर को लॉगिन पेज पर भेज दिया (अपनी रूट के हिसाब से बदल लें)
    }
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="hs-profile-container">
      
      {/* PROFILE CARD */}
      <div className="hs-profile-card">
        
        {/* वास्तविक काम करने वाला लॉगआउट बटन */}
        <button className="hs-logout-btn" onClick={handleLogout} title="Logout">
          🚪 <span className="hs-logout-text">Logout</span>
        </button>

        <div className="hs-top-section">
          <img
            src={
              user.profilePic
                ? `https://latestjobportal-11.onrender.com/uploads/${user.profilePic}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt=""
            className="hs-profile-image"
          />

          <div className="hs-profile-info">
            <h2 className="hs-user-name">{user.fullName}</h2>
            <p className="hs-user-email">📧 {user.email}</p>
            <p className="hs-user-phone">📞 {user.contactNumber}</p>

            <div className="hs-btn-group">
              {user.resume && (
                <a
                  href={`http://localhost:2340/uploads/${user.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hs-btn hs-resume-btn"
                >
                  Resume
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
          {user.summary ? user.summary : "No summary added"}
        </p>
      </div>

      {/* EDUCATION */}
      <div className="hs-box hs-qualification-box">
        <h3 className="hs-section-heading">Qualifications</h3>
        {user.education?.length > 0 ? (
          user.education.map((item, index) => (
            <div key={index} className="hs-education-item">
              <h4 className="hs-edu-title">{item.qualification}</h4>
              <div className="hs-edu-content">
                <p className="hs-edu-year">{item.year}</p>
                <p className="hs-college-name">
                  <strong>College / School Name:</strong> {item.college}
                </p>
                <p className="hs-stream-name">
                  <strong>Stream:</strong> {item.stream}
                </p>
                <p className="hs-cgpa">
                  <strong>CGPA:</strong> {item.cgpa}
                </p>
                <p className="hs-percentage">
                  <strong>Percentage:</strong> {item.percentage}
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
        {user.experience?.length > 0 ? (
          user.experience.map((item, index) => (
            <div key={index} className="hs-experience-item">
              <h4 className="hs-exp-title">{item.employerName}</h4>
              <div className="hs-exp-content">
                <p className="hs-employment-type">
                  <strong>Employment Type:</strong> {item.employmentType}
                </p>
                <p className="hs-designation">
                  <strong>Designation:</strong> {item.designation}
                </p>
                <p className="hs-from-date">
                  <strong>From:</strong> {item.fromDate}
                </p>
                <p className="hs-to-date">
                  <strong>To:</strong> {item.toDate}
                </p>
                <p className="hs-ctc">
                  <strong>CTC:</strong> {item.ctc}
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