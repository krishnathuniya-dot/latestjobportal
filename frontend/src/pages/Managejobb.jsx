import React, { useEffect, useState } from "react";
import "../css/managejob.css";
import { useNavigate } from "react-router-dom";

export default function Managejobb() {
  const [jobData, setJobData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  const navigate = useNavigate();

  // सुरक्षित तरीके से LocalStorage से यूजर आईडी निकालना
  const storedUser = localStorage.getItem("User");
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  // ध्यान दें: अगर आपके डेटाबेस में id की की 'id' है तो 'user?.id' का इस्तेमाल करें
  const userId = user?._id || user?.id; 

  const fetchJobs = async () => {
    try {
      if (!userId) {
        console.log("User ID not found in localStorage");
        setLoading(false);
        return;
      }

      setLoading(true);
      // यहाँ सिर्फ लॉग-इन यूजर की आईडी ही बैकएंड पर जा रही है
      const response = await fetch(
        `http://localhost:2340/api/alljobs/${userId}`
      );

      const data = await response.json();
      console.log("Employer Jobs Response =", data);

      if (data.success) {
        setJobData(data.data || []);
      } else {
        setJobData([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false); // API कॉल खत्म होने पर loading बंद
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [userId]); // Dependency array में userId डाला ताकि आईडी मिलने पर ही रन हो

  // जॉब टाइटल के आधार पर सर्च फ़िल्टर
  const filterJobs = jobData.filter((item) =>
    item?.jobTitle
      ?.toLowerCase()
      .includes(searchText.toLowerCase())
  );

  if (loading) {
    return <h2 className="agagi_jobs_nodata">Loading your posted jobs...</h2>;
  }

  return (
    <div className="agagi_jobs_main_container">

      {/* Search */}
      <div className="agagi_jobs_search_section">
        <input
          type="text"
          placeholder="Search Job Title"
          className="agagi_jobs_search_input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="agagi_jobs_search_btn">🔍</button>
      </div>

      {/* Heading with Total Count Badge */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <h1 className="agagi_jobs_heading" style={{ margin: 0 }}>My Posted Jobs</h1>
        
        {/* यह बैज सिर्फ इस यूजर की पोस्ट की हुई जॉब्स का काउंट दिखाएगा */}
        <span style={{
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          padding: "4px 12px",
          borderRadius: "50px",
          fontSize: "14px",
          fontWeight: "600",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          Total Posted: {jobData.length}
        </span>
      </div>

      {/* Jobs */}
      {filterJobs.length > 0 ? (
        filterJobs.map((item) => (
          <div
            className="agagi_jobs_card"
            key={item._id}
            onClick={() => navigate(`/apply/${item._id}`)}
          >
            <div className="agagi_jobs_left">
              
              {/* Company Logo */}
              {item?.employerId?.logo ? (
                <img
                  src={`http://localhost:2340/uploads/${item.employerId.logo}`}
                  alt={item?.employerId?.companyName || "Company"}
                  className="company-logo"
                />
              ) : (
                <div className="default-logo">
                  {item?.employerId?.companyName
                    ?.charAt(0)
                    ?.toUpperCase() || "C"}
                </div>
              )}

              <div>
                <h2 className="agagi_jobs_title">{item.jobTitle}</h2>
                <p className="agagi_jobs_company">
                  {item?.employerId?.companyName || "Company"}
                </p>
                <div className="agagi_jobs_info">
                  <span>📍 {item.jobLocation}</span>
                  <span>📅 {item.createdAt?.slice(0, 10)}</span>
                </div>
                <h3 className="agagi_jobs_salary">💰 ₹{item.salaryPackage}</h3>
              </div>
            </div>

            <button
              className="agagi_jobs_type_btn"
              onClick={(e) => e.stopPropagation()}
            >
              {item.jobType}
            </button>
          </div>
        ))
      ) : (
        <h2 className="agagi_jobs_nodata">No Jobs Posted Yet</h2>
      )}
    </div>
  );
}