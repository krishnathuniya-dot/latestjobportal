// 📂 Navvvv.jsx

import React from "react";
import { Link } from "react-router-dom";
import "../css/Navvvv.css";

export default function Navvvv() {
  return (
    <div>

      {/* Navbar */}
      <div className="kl_navbar">

        {/* Logo */}
        <div className="kl_logo">
          Job Portal
        </div>

        {/* Menu */}
        <ul className="kl_menu">

          <li>
            <Link to="/" className="kl_link">
              Home
            </Link>
          </li>

          <li>
            <Link to="/jobs" className="kl_link">
              Jobs
            </Link>
          </li>

          <li>
            <Link to="/candidates" className="kl_link">
              Candidates
            </Link>
          </li>

          <li>
            <Link to="/reports" className="kl_link">
              Reports
            </Link>
          </li>

        </ul>

      </div>

    </div>
  );
}