import React, { useState } from "react";
import "../css/education.css";

const Education = () => {
  const [loading, setLoading] = useState(false);
  const [education, setEducation] = useState({
    qualification: "",
    college: "",
    year: "",
    percentage: "",
    stream: "",
    cgpa: "",
  });

  const handleChange = (e) => {
    setEducation({ ...education, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(`http://localhost:2340/api/add-education/${user._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(education),
      });

      const data = await response.json();
      if (data.success) {
        alert("Education Added Successfully");
        setEducation({ qualification: "", college: "", year: "", percentage: "", stream: "", cgpa: "" });
      } else {
        alert(data.message || "Failed to add education");
      }
    } catch (error) {
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="education-detail-container">
      <div className="education-detail-header">
        <h1>User Education Details</h1>
      </div>
<form className="education-detail-form" onSubmit={handleSubmit}>
  <div className="education-detail-row">
    <div className="education-detail-group">
      <label>Qualification *</label>
      <select name="qualification" value={education.qualification} onChange={handleChange} required>
        <option value="">Select Qualification</option>
        <option value="10">10th</option>
        <option value="12">12th</option>
        <option value="bca">BCA</option>
        <option value="mca">MCA</option>
        <option value="btech">B.Tech</option>
        <option value="bsc">B.Sc</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div className="education-detail-group">
      <label>School/College Name *</label>
      <input 
        type="text" 
        name="college" 
        placeholder="Enter your school or college name" 
        value={education.college} 
        onChange={handleChange} 
        required 
      />
    </div>
  </div>

  <div className="education-detail-row">
    <div className="education-detail-group">
      <label>Year of Passing</label>
      <input 
        type="number" 
        name="year" 
        placeholder="e.g. 2024" 
        value={education.year} 
        onChange={handleChange} 
      />
    </div>
    <div className="education-detail-group">
      <label>Percentage (%)</label>
      <input 
        type="number" 
        name="percentage" 
        placeholder="Enter percentage (e.g. 85)" 
        value={education.percentage} 
        onChange={handleChange} 
      />
    </div>
  </div>

  <div className="education-detail-row">
    <div className="education-detail-group">
      <label>Stream</label>
      <input 
        type="text" 
        name="stream" 
        placeholder="e.g. Computer Science" 
        value={education.stream} 
        onChange={handleChange} 
      />
    </div>
    <div className="education-detail-group">
      <label>CGPA</label>
      <input 
        type="number" 
        step="0.01" 
        name="cgpa" 
        placeholder="e.g. 9.0" 
        value={education.cgpa} 
        onChange={handleChange} 
      />
    </div>
  </div>

  <button type="submit" className="education-detail-btn" disabled={loading}>
    {loading ? "Saving..." : "ADD EDUCATION"}
  </button>
</form>
    </div>
  );
};

export default Education;