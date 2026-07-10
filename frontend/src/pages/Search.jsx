// 📂 Jobs.jsx

import React from "react";
import { FaSearch } from "react-icons/fa";
import "../css/serach.css";

export default function Search() {
  return (
    <div className="jobs-page">
      
      {/* Top Blue Section */}
      <div className="top-banner">
       

        <h1>Employer | Jobs listing</h1>
      </div>

      {/* Search Box */}
      <div className="search-section">
        <div className="search-box">
          <input type="text" placeholder="Enter Job Title" />

          <button>
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Latest Jobs */}
      <div className="latest-jobs">
        <h2>Latest Jobs</h2>

        <div className="pagination">
          <button>Previous</button>
          <button className="active">1</button>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
}