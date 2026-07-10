import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Dash.css";

const Dash = () => {
  const [dashboard] = useState({
    totalCategories: 5,
    totalEmployers: 3,
    totalCandidates: 2,
    totalJobs: 7,
  });

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Dashboard</h2>
      </div>

      <div className="cards">

        <Link to="/manage-category" className="card-link">
          <div className="card">
            <div className="count">{dashboard.totalCategories}</div>
            <div className="icon">📖</div>
            <h3>Total Job Category</h3>
          </div>
        </Link>

        <Link to="/employerlist" className="card-link">
          <div className="card">
            <div className="count">{dashboard.totalEmployers}</div>
            <div className="icon">🏢</div>
            <h3>Total Registered Employer</h3>
          </div>
        </Link>

        <Link to="/jobseekerlist" className="card-link">
          <div className="card">
            <div className="count">{dashboard.totalCandidates}</div>
            <div className="icon">👥</div>
            <h3>Total Registered Candidates</h3>
          </div>
        </Link>

        <Link to="/jobs" className="card-link">
          <div className="card">
            <div className="count">{dashboard.totalJobs}</div>
            <div className="icon">💼</div>
            <h3>Total Listed Jobs</h3>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default Dash;