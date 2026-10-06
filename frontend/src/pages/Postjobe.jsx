import React, { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiCode,
  FiCalendar,
  FiFileText,
  FiLayers,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import "../css/postjob.css";

export default function Postjob() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

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
      setLoadingCategories(true);

      const res = await fetch(
        "https://latestjobportal.onrender.com/api/categories"
      );

      const data = await res.json();

      if (data.success) {
        setCategories(Array.isArray(data.data) ? data.data : []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);

      setMessage({
        type: "error",
        text: "Unable to load job categories.",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  const resetForm = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    try {
      const user = JSON.parse(localStorage.getItem("User"));

      if (!user?._id) {
        setMessage({
          type: "error",
          text: "Please login first to post a job.",
        });
        return;
      }

      if (!jobData.category) {
        setMessage({
          type: "error",
          text: "Please select a job category.",
        });
        return;
      }

      if (!jobData.jobTitle.trim()) {
        setMessage({
          type: "error",
          text: "Please enter the job title.",
        });
        return;
      }

      const payload = {
        ...jobData,
        employerId: user._id,
      };

      console.log("Payload:", payload);

      setIsSubmitting(true);

      const res = await fetch(
        "https://latestjobportal.onrender.com/api/postjob",
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
        if (data.job?._id) {
          localStorage.setItem("jobId", data.job._id);
        }

        setMessage({
          type: "success",
          text: "Job posted successfully!",
        });

        resetForm();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Unable to post the job.",
        });
      }
    } catch (error) {
      console.error("Error posting job:", error);

      setMessage({
        type: "error",
        text: "Something went wrong while posting the job.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="postjob-page">

      {/* Header */}
      <div className="postjob-header">
        <div className="postjob-header-content">
          <div className="postjob-header-icon">
            <FiBriefcase />
          </div>

          <div>
            <span className="postjob-header-small">
              EMPLOYER PANEL
            </span>

            <h1>Post a New Job</h1>

            <p>
              Find the right talent by creating a detailed job listing.
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="postjob-wrapper">

        {/* Info Card */}
        <div className="postjob-intro">
          <div className="postjob-intro-icon">
            <FiFileText />
          </div>

          <div>
            <h2>Create Your Job Listing</h2>
            <p>
              Provide accurate job information to attract the best
              candidates for your organization.
            </p>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`postjob-message ${
              message.type === "success"
                ? "postjob-success"
                : "postjob-error"
            }`}
          >
            {message.type === "success" ? (
              <FiCheckCircle />
            ) : (
              <FiAlertCircle />
            )}

            <span>{message.text}</span>
          </div>
        )}

        {/* Form */}
        <form
          className="postjob-form"
          onSubmit={handleSubmit}
        >
          <div className="postjob-section-title">
            <span className="postjob-section-number">01</span>

            <div>
              <h3>Job Information</h3>
              <p>Tell candidates about the position.</p>
            </div>
          </div>

          <div className="postjob-grid">

            {/* Category */}
            <div className="postjob-field">
              <label>
                <FiLayers />
                Category <span>*</span>
              </label>

              <select
                name="category"
                value={jobData.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select Category"}
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
            <div className="postjob-field">
              <label>
                <FiBriefcase />
                Job Title <span>*</span>
              </label>

              <input
                type="text"
                name="jobTitle"
                placeholder="e.g. Software Application Developer"
                value={jobData.jobTitle}
                onChange={handleChange}
                required
              />
            </div>

            {/* Job Type */}
            <div className="postjob-field">
              <label>
                <FiClock />
                Job Type
              </label>

              <select
                name="jobType"
                value={jobData.jobType}
                onChange={handleChange}
              >
                <option value="">Select Job Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Salary */}
            <div className="postjob-field">
              <label>
                <FiDollarSign />
                Salary Package
              </label>

              <input
                type="text"
                name="salaryPackage"
                placeholder="e.g. 80,000 - 1,00,000"
                value={jobData.salaryPackage}
                onChange={handleChange}
              />
            </div>

            {/* Skills */}
            <div className="postjob-field">
              <label>
                <FiCode />
                Skills Required
              </label>

              <input
                type="text"
                name="skillRequired"
                placeholder="PHP, MySQL, HTML, Bootstrap"
                value={jobData.skillRequired}
                onChange={handleChange}
              />

              <small>
                Separate multiple skills with commas.
              </small>
            </div>

            {/* Experience */}
            <div className="postjob-field">
              <label>
                <FiBriefcase />
                Experience
              </label>

              <input
                type="text"
                name="experience"
                placeholder="e.g. 2-5 years"
                value={jobData.experience}
                onChange={handleChange}
              />
            </div>

            {/* Location */}
            <div className="postjob-field">
              <label>
                <FiMapPin />
                Job Location
              </label>

              <input
                type="text"
                name="jobLocation"
                placeholder="e.g. New Delhi"
                value={jobData.jobLocation}
                onChange={handleChange}
              />
            </div>

            {/* Expiration */}
            <div className="postjob-field">
              <label>
                <FiCalendar />
                Job Expiration Date
              </label>

              <input
                type="date"
                name="jobExpirationDate"
                value={jobData.jobExpirationDate}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="postjob-field postjob-full">
              <label>
                <FiFileText />
                Job Description
              </label>

              <textarea
                name="jobDescription"
                rows="7"
                placeholder="Describe the role, responsibilities, requirements and other important details..."
                value={jobData.jobDescription}
                onChange={handleChange}
              />

              <small>
                A clear description helps candidates understand the role better.
              </small>
            </div>
          </div>

          {/* Submit */}
          <div className="postjob-submit-area">
            <div className="postjob-submit-info">
              <strong>Ready to find your next employee?</strong>
              <span>
                Review your information and publish the job.
              </span>
            </div>

            <button
              type="submit"
              className="postjob-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="postjob-spinner"></span>
                  Posting...
                </>
              ) : (
                <>
                  <FiSend />
                  Post Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}