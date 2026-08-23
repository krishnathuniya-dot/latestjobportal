import React, { useEffect, useState } from "react";
import "../css/applicants.css";
import { useNavigate } from "react-router-dom";

export default function Canditatelist() {
  // 🎯 यहाँ 'setApplicants' को बिल्कुल सही तरीके से डिक्लेयर किया गया है
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchApplicants = async () => {
    try {
      // 1️⃣ लोकल स्टोरेज से एम्प्लॉयर (नियोक्ता) का डेटा और आईडी निकाली
      const storedEmployer = JSON.parse(localStorage.getItem("User"));
      const employerId = storedEmployer?._id;

      if (!employerId) {
        alert("Please Login First as an Employer!");
        navigate("/login");
        return;
      }

      // 2️⃣ लोकल स्टोरेज से जॉब आईडी निकाली
      const jobId = localStorage.getItem("jobId");

      if (!jobId) {
        alert("No Job Selected!");
        setLoading(false);
        return;
      }

      // 3️⃣ एपीआई कॉल में ?employerId=${employerId} को पास किया
      const response = await fetch(
        `https://latestjobportal-11.onrender.com/api/applicants/${jobId}?employerId=${employerId}`
      );

      const data = await response.json();

      if (data.success) {
        // ✅ यहाँ अब सही 'setApplicants' फंक्शन कॉल हो रहा है, जिससे एरर नहीं आएगी
        setApplicants(data.data || []);
      } else {
        setApplicants([]);
      }
    } catch (error) {
      console.log("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading Applicants...</h2>;
  }

  return (
    <div className="applicant-container">
      <h1 className="page-title">Job Applicants</h1>

      {applicants.length > 0 ? (
        applicants.map((item) => (
          <div className="applicant-card" key={item._id}>
            
            {/* प्रोफाइल इमेज */}
            {item.candidateId?.profilePic ? (
              <img
                src={`https://latestjobportal-11.onrender.com/uploads/${item.candidateId.profilePic}`}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Default Profile"
                className="profile-image"
              />
            )}

            <div className="applicant-content">
              {/* कैंडिडेट का नाम */}
              <h2 className="candidate-name">
                {item.candidateId?.fullName || item.candidateId?.name || "Candidate Name"}
              </h2>

              <p className="apply-date">
                Applied Date :{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>

              <h3 className="job-title">
                Applied For Job : {item.jobId?.jobTitle}
              </h3>

              <div className="contact-row">
                <span>📞 {item.candidateId?.contactNumber || item.candidateId?.mobile || "N/A"}</span>
                <span>📧 {item.candidateId?.email || "N/A"}</span>
              </div>

              <div className="skill-row">
                🔖 Required Skills: {item.jobId?.skillRequired || "N/A"}
              </div>

              <div className="btn-group">
                <button
                  className="resume-btn"
                  onClick={() =>
                    window.open(
                      `https://latestjobportal-11.onrender.com/uploads/${item.candidateId?.resume}`,
                      "_blank"
                    )
                  }
                >
                  RESUME
                </button>
                
                <button
                  className="detail-btn"
                  onClick={() => navigate(`/view/${item.candidateId?._id}`)}
                >
                  VIEW DETAIL
                </button>

                <button
                  className="application-btn"
                  onClick={() => navigate(`/applicationdetails/${item._id}`)}
                >
                  APPLICATION DETAILS
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h3 style={{ textAlign: "center", marginTop: "30px" }}>
          No applicants found for this job post.
        </h3>
      )}
    </div>
  );
}