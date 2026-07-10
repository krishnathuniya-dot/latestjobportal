import React, { useState } from "react";
import "../css/experience.css";

const Experience = () => {
  const [experience, setExperience] = useState({
    employerName: "",
    employmentType: "",
    designation: "",
    fromDate: "",
    toDate: "",
    ctc: "",
  });

  const handleChange = (e) => {
    setExperience({
      ...experience,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    try {
      const response = await fetch(
        `http://localhost:2340/api/add-experience/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            experience
          ),
        }
      );

      const data =
        await response.json();

      if (data.success) {
        alert(
          "Experience Added Successfully"
        );

        setExperience({
          employerName: "",
          employmentType: "",
          designation: "",
          fromDate: "",
          toDate: "",
          ctc: "",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <div>
      <div className="exp-header">
        <h1>
          User Experience Details
        </h1>
      </div>

      <form
        className="exp-form"
        onSubmit={handleSubmit}
      >
        <div className="exp-row">

          <div className="exp-group">
            <label>
              Employer Name *
            </label>

            <input
              type="text"
              name="employerName"
              value={
                experience.employerName
              }
              onChange={handleChange}
              required
            />
          </div>

          <div className="exp-group">
            <label>
              Type of Employment *
            </label>

            <input
              type="text"
              name="employmentType"
              value={
                experience.employmentType
              }
              onChange={handleChange}
              placeholder="eg fulltime, parttime"
              required
            />
          </div>

        </div>

        <div className="exp-row">

          <div className="exp-group">
            <label>
              Designation
            </label>

            <input
              type="text"
              name="designation"
              value={
                experience.designation
              }
              onChange={handleChange}
              placeholder="Enter Designation"
            />
          </div>

          <div className="exp-group">
            <label>
              From Date
            </label>

            <input
              type="date"
              name="fromDate"
              value={
                experience.fromDate
              }
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="exp-row">

          <div className="exp-group">
            <label>
              CTC(per month)
            </label>

            <input
              type="text"
              name="ctc"
              value={experience.ctc}
              onChange={handleChange}
              placeholder="Enter CTC"
            />
          </div>

          <div className="exp-group">
            <label>
              To Date
            </label>

            <input
              type="date"
              name="toDate"
              value={
                experience.toDate
              }
              onChange={handleChange}
            />
          </div>

        </div>

        <hr />

        <button
          type="submit"
          className="exp-btn"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default Experience;