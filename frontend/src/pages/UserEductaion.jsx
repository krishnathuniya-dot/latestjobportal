import React, { useState } from "react";
import {
  FiBookOpen,
  FiBriefcase,
  FiCalendar,
  FiPercent,
  FiLayers,
  FiHash,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import "../css/education.css";

const UserEducation = () => {
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [education, setEducation] = useState({
    qualification: "",
    college: "",
    year: "",
    percentage: "",
    stream: "",
    cgpa: "",
  });

  const handleChange = (e) => {
    setEducation({
      ...education,
      [e.target.name]: e.target.value,
    });

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  const resetForm = () => {
    setEducation({
      qualification: "",
      college: "",
      year: "",
      percentage: "",
      stream: "",
      cgpa: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setMessage({
        type: "error",
        text: "Please login first to add your education details.",
      });
      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Invalid user session. Please login again.",
      });
      return;
    }

    if (!user?._id) {
      setMessage({
        type: "error",
        text: "User information not found. Please login again.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://latestjobportal.onrender.com/api/add-education/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(education),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: "Education details added successfully!",
        });

        resetForm();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to add education details.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Server error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="education-detail-container">

      {/* =========================
          HEADER
      ========================== */}

      <div className="education-detail-header">

        <div className="education-header-icon">
          <FiBookOpen />
        </div>

        <div>
          <h1>Education Details</h1>

          <p>
            Add your academic qualification and educational background
          </p>
        </div>

      </div>

      {/* =========================
          FORM CARD
      ========================== */}

      <div className="education-detail-card">

        {/* Status Message */}

        {message.text && (
          <div
            className={`education-message ${
              message.type === "success"
                ? "education-success"
                : "education-error"
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

        <form
          className="education-detail-form"
          onSubmit={handleSubmit}
        >

          {/* =========================
              ROW 1
          ========================== */}

          <div className="education-detail-row">

            <div className="education-detail-group">

              <label>
                <FiBookOpen />
                Qualification <span>*</span>
              </label>

              <div className="education-input-wrapper">

                <FiBookOpen />

                <select
                  name="qualification"
                  value={education.qualification}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Qualification
                  </option>

                  <option value="10">
                    10th
                  </option>

                  <option value="12">
                    12th
                  </option>

                  <option value="bca">
                    BCA
                  </option>

                  <option value="mca">
                    MCA
                  </option>

                  <option value="btech">
                    B.Tech
                  </option>

                  <option value="bsc">
                    B.Sc
                  </option>

                  <option value="other">
                    Other
                  </option>

                </select>

              </div>

            </div>


            <div className="education-detail-group">

              <label>
                <FiBriefcase />
                School / College Name <span>*</span>
              </label>

              <div className="education-input-wrapper">

                <FiBriefcase />

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

          </div>


          {/* =========================
              ROW 2
          ========================== */}

          <div className="education-detail-row">

            <div className="education-detail-group">

              <label>
                <FiCalendar />
                Year of Passing
              </label>

              <div className="education-input-wrapper">

                <FiCalendar />

                <input
                  type="number"
                  name="year"
                  placeholder="e.g. 2024"
                  value={education.year}
                  onChange={handleChange}
                  min="1950"
                  max="2100"
                />

              </div>

            </div>


            <div className="education-detail-group">

              <label>
                <FiPercent />
                Percentage (%)
              </label>

              <div className="education-input-wrapper">

                <FiPercent />

                <input
                  type="number"
                  name="percentage"
                  placeholder="e.g. 85"
                  value={education.percentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                />

              </div>

            </div>

          </div>


          {/* =========================
              ROW 3
          ========================== */}

          <div className="education-detail-row">

            <div className="education-detail-group">

              <label>
                <FiLayers />
                Stream
              </label>

              <div className="education-input-wrapper">

                <FiLayers />

                <input
                  type="text"
                  name="stream"
                  placeholder="e.g. Computer Science"
                  value={education.stream}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="education-detail-group">

              <label>
                <FiHash />
                CGPA
              </label>

              <div className="education-input-wrapper">

                <FiHash />

                <input
                  type="number"
                  step="0.01"
                  name="cgpa"
                  placeholder="e.g. 9.00"
                  value={education.cgpa}
                  onChange={handleChange}
                  min="0"
                  max="10"
                />

              </div>

            </div>

          </div>


          {/* =========================
              BUTTON
          ========================== */}

          <button
            type="submit"
            className="education-detail-btn"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="education-spinner"></span>
                Saving Education...
              </>
            ) : (
              <>
                <FiSave />
                Add Education
              </>
            )}

          </button>

        </form>

      </div>

    </div>
  );
};

export default UserEducation;