import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/apply.css";

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch Single Job
  const fetchSingleJob = async () => {
    try {
      const response = await fetch(
        `https://latestjobportal-11.onrender.com/api/managejob/${id}`
      );
      const data = await response.json();
      
      // 🎯 अगर बैकएंड से सीधे ऑब्जेक्ट आ रहा है या data.data में है, दोनों को हैंडल किया
      setJob(data.job || data.data || data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleJob();
  }, [id]);

  // Apply Job Function
  const handleApply = async () => {
    try {
      const homeseekerData = JSON.parse(localStorage.getItem("user"));
      const candidateId = homeseekerData?._id;

      if (!candidateId) {
        alert("Please Login First as a Homeseeker to Apply for this Job!");
        navigate("/login"); 
        return;
      }

      const response = await fetch(
        "https://latestjobportal-11.onrender.com/api/applyjob",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            candidateId,
            jobId: job._id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Job Applied Successfully 👍");
        console.log(data);
      } else {
        alert(data.message || "Application Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading Job Details...</h2>;
  }

  return (
    <div className="jobdetails_main">
      <div className="jobdetails_wrapper">

        {/* LEFT CONTENT */}
        <div className="jobdetails_content">
          <div className="jobdetails_header">
            
            {/* 🎯 फिक्स: लोगो रेंडरिंग (RecenthotsJob के लॉजिक पर आधारित) */}
            {job?.employerId?.logo ? (
              <img
                src={`https://latestjobportal-11.onrender.com/uploads/${job.employerId.logo}`}
                alt={job?.employerId?.companyName}
                className="company_logo"
                onError={(e) => {
                  // अगर इमेज लोड फेल हो तो उसे हाइड करके उसकी जगह टेक्स्ट वाला बॉक्स दिखा दे
                  e.target.style.display = "none";
                  const fallback = e.target.parentElement.querySelector(".fallback_logo");
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}

            {/* लोगो न होने या टूटने की स्थिति में दिखने वाला अल्टरनेटिव बॉक्स */}
            {(!job?.employerId?.logo || job?.employerId?.logo) && (
              <div 
                className="fallback_logo default-logo" 
                style={{ 
                  display: job?.employerId?.logo ? "none" : "flex",
                  width: "80px", 
                  height: "80px", 
                  borderRadius: "8px", 
                  backgroundColor: "#4f46e5", 
                  color: "#fff", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  fontSize: "32px", 
                  fontWeight: "bold" 
                }}
              >
                {job?.employerId?.companyName?.charAt(0)?.toUpperCase() || "C"}
              </div>
            )}

            <div className="jobdetails_info_box">
              <h1>{job?.jobTitle}</h1>
              <p className="company_name">
                {job?.employerId?.companyName || "Company"}
                <span> (View All Jobs)</span>
              </p>

              <div className="job_meta">
                <span>📍 {job?.jobLocation}</span>
                <span>📅 {job?.createdAt?.slice(0, 10)}</span>
              </div>

              <h2 className="salary">₹{job?.salaryPackage}</h2>

              <div className="job_actions">
                <button className="fulltime_btn">{job?.jobType}</button>
                <button
                  className="apply_btn"
                  onClick={handleApply}
                >
                  APPLY FOR THIS JOB
                </button>
              </div>
            </div>
          </div>

          <div className="detail_section">
            <h3>Overview</h3>
            <p>{job?.jobDescription}</p>
          </div>

          <div className="detail_section">
            <h3>Required Experience</h3>
            <p>{job?.experience}</p>
          </div>

          <div className="detail_section">
            <h3>Skills Required</h3>
            <p>{job?.skillRequired}</p>
          </div>

          <div className="detail_section">
            <h3>Job Location</h3>
            <p>{job?.jobLocation}</p>
          </div>

          <div className="detail_section">
            <h3>Salary Package</h3>
            <p>₹{job?.salaryPackage}</p>
          </div>

          <div className="detail_section">
            <h3>Date of Job Posting</h3>
            <p>{job?.createdAt?.slice(0, 10)}</p>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="company_sidebar">
          <div className="sidebar_card">
            
            {/* 🎯 फिक्स: साइडबार लोगो */}
            {job?.employerId?.logo ? (
              <img
                src={`https://latestjobportal-11.onrender.com/uploads/${job.employerId.logo}`}
                alt={job?.employerId?.companyName}
                className="sidebar_banner"
                onError={(e) => {
                  e.target.style.display = "none";
                  const fallback = e.target.parentElement.querySelector(".sidebar_fallback_logo");
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}

            {/* साइडबार के लिए अल्टरनेटिव बॉक्स */}
            {(!job?.employerId?.logo || job?.employerId?.logo) && (
              <div 
                className="sidebar_fallback_logo" 
                style={{ 
                  display: job?.employerId?.logo ? "none" : "flex",
                  width: "100%", 
                  height: "150px", 
                  backgroundColor: "#e2e8f0", 
                  color: "#475569", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  fontSize: "48px", 
                  fontWeight: "bold" 
                }}
              >
                {job?.employerId?.companyName?.charAt(0)?.toUpperCase() || "C"}
              </div>
            )}

            <div className="sidebar_body">
              <h2>{job?.employerId?.companyName || "Company"}</h2>

              <div className="sidebar_item">
                <strong>Industry</strong>
                <p>{job?.category}</p>
              </div>

              <div className="sidebar_item">
                <strong>Type of Business Entity</strong>
                <p>Pvt Ltd</p>
              </div>

              <div className="sidebar_item">
                <strong>Established In</strong>
                <p>2000</p>
              </div>

              <div className="sidebar_item">
                <strong>No. of Employees</strong>
                <p>10000</p>
              </div>

              <div className="sidebar_item">
                <strong>Location</strong>
                <p>{job?.jobLocation}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}