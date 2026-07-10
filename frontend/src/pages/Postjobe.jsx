import React, { useState, useEffect } from "react";
import "../css/postjob.css";

export default function Postjob() {
  const [categories, setCategories] = useState([]);

  const [jobData, setJobData] = useState({
    category: "",
    jobTitle: "",
    jobType: "",
    salaryPackage: "",
    skillRequired: "",
    experience: "2-5",
    jobLocation: "",
    jobExpirationDate: "",
    jobDescription: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "http://localhost:2340/api/categories"
      );

      const data = await res.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(
        localStorage.getItem("User")
      );

      if (!user?._id) {
        alert("Please Login First");
        return;
      }

      const payload = {
        ...jobData,
        employerId: user._id,
      };

      console.log("Payload:", payload);

      const res = await fetch(
        "http://localhost:2340/api/postjob",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      console.log("Response:", data);

      if (data.success) {
        localStorage.setItem(
          "jobId",
          data.job._id
        );

        alert("Job Posted Successfully!");

        setJobData({
          category: "",
          jobTitle: "",
          jobType: "",
          salaryPackage: "",
          skillRequired: "",
          experience: "2-5",
          jobLocation: "",
          jobExpirationDate: "",
          jobDescription: "",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Something went wrong while posting the job.");
    }
  };

  return (
    <div className="ddd_container">
      <div className="ddd_header_bar">
        <h1>Employers | Post a Job</h1>
      </div>

      <div className="ddd_form_wrapper">
        <form
          className="ddd_job_form"
          onSubmit={handleSubmit}
        >
          <div className="ddd_grid">

            {/* Category */}
            <div className="ddd_input_box">
              <label>Category*</label>

              <select
                name="category"
                value={jobData.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat.category}
                  >
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Title */}
            <div className="ddd_input_box">
              <label>Job Title*</label>

              <input
                type="text"
                name="jobTitle"
                placeholder="Software Application Developer"
                value={jobData.jobTitle}
                onChange={handleChange}
                required
              />
            </div>

            {/* Job Type */}
            <div className="ddd_input_box">
              <label>Job Type</label>

              <select
                name="jobType"
                value={jobData.jobType}
                onChange={handleChange}
              >
                <option value="">
                  Select Job Type
                </option>
                <option value="Full Time">
                  Full Time
                </option>
                <option value="Part Time">
                  Part Time
                </option>
                <option value="Contract">
                  Contract
                </option>
                <option value="Remote">
                  Remote
                </option>
              </select>
            </div>

            {/* Salary Package */}
            <div className="ddd_input_box">
              <label>Salary Package</label>

              <input
                type="text"
                name="salaryPackage"
                placeholder="80000-100000"
                value={jobData.salaryPackage}
                onChange={handleChange}
              />
            </div>

            {/* Skill Required */}
            <div className="ddd_input_box">
              <label>Skill Required</label>

              <input
                type="text"
                name="skillRequired"
                placeholder="PHP, MySQL, HTML, Bootstrap"
                value={jobData.skillRequired}
                onChange={handleChange}
              />
            </div>

            {/* Experience */}
            <div className="ddd_input_box">
              <label>Experience</label>

              <input
                type="text"
                name="experience"
                placeholder="2-5"
                value={jobData.experience}
                onChange={handleChange}
              />
            </div>

            {/* Job Location */}
            <div className="ddd_input_box">
              <label>Job Location</label>

              <input
                type="text"
                name="jobLocation"
                placeholder="e.g. New Delhi"
                value={jobData.jobLocation}
                onChange={handleChange}
              />
            </div>

            {/* Expiry Date */}
            <div className="ddd_input_box">
              <label>Job Expiration Date</label>

              <input
                type="date"
                name="jobExpirationDate"
                value={jobData.jobExpirationDate}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="ddd_input_box ddd_full_width">
              <label>Job Description</label>

              <textarea
                name="jobDescription"
                rows="6"
                value={jobData.jobDescription}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ddd_action_section">
            <button
              type="submit"
              className="ddd_submit_btn"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}