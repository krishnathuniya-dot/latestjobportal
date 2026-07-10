import React, { useState, useEffect } from 'react';
import { data, useParams } from 'react-router-dom';
import '../css/fulldetails.css';

const Fulldetails = ({ jobseekerId }) => {
  const { id } = useParams();
  const idToFetch = jobseekerId || id;

  const [seeker, setSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:2340";

  useEffect(() => {
 const fetchJobseekerData = async () => {
  try {
    setLoading(true);

    console.log("ID:", idToFetch);

    const response = await fetch(`${BASE_URL}/api/profile/${idToFetch}`);

    console.log("Response:", response);

    const data = await response.json();

    console.log("API Data:", data);

    if (!response.ok) {
      throw new Error(data.message);
    }

    setSeeker(data.user); // Backend response ke hisaab se
  } catch (err) {
    console.error("Error:", err);
    setError(err.message);
  } finally { 
    setLoading(false);
  }
};

    if (idToFetch) fetchJobseekerData();
  }, [idToFetch]);

  if (loading) return <div className="text-center-status">Loading...</div>;
  if (error) return <div className="text-center-status error-text">Error: {error}</div>;
  if (!seeker) return <div className="text-center-status">No Data Found.</div>;

  // FIX: Sahi image aur resume path
  const profilePicUrl = seeker.profilePic ? `${BASE_URL}/uploads/${seeker.profilePic}` : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  const resumeUrl = seeker.resume ? `${BASE_URL}/uploads/${seeker.resume}` : null;

  return (
    <div className="jobseeker-container">
      <h2 className="main-title">Jobseeker Profile Dashboard</h2>
      
      <div className="details-card">
        <div className="card-header">View Jobseeker Details</div>

        <div className="grid-4-col">
          <div className="label-cell">Full Name</div>
          <div className="data-cell">{seeker.fullName || "N/A"}</div>
          
          <div className="label-cell">Email ID</div>
          <div className="data-cell">{seeker.email || "N/A"}</div>

          <div className="label-cell">Contact Number</div>
          <div className="data-cell">{seeker.contactNumber || "N/A"}</div>
          
          <div className="label-cell">Resume</div>
          <div className="data-cell">
            {resumeUrl ? (
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="resume-link">📄 View Resume</a>
            ) : "Not Uploaded"}
          </div>
        </div>

        <div className="section-sub-header">About Job Seeker</div>
        <div className="summary-area">
          {seeker.summary || "No summary provided."}
        </div>

        <div className="grid-4-col no-bottom-border">
          <div className="label-cell">Profile Pic</div>
          <div className="data-cell">
            <img 
              src={profilePicUrl} 
              alt="Profile" 
              className="profile-img" 
              style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
          
          <div className="label-cell">Skills</div>
          <div className="data-cell">
            {seeker.skills || "No skills listed"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fulldetails;