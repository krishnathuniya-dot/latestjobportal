import React from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";

export default function Navbar() {
  return (
    <nav className="pk_navbar">

      {/* Logo */}
      <div className="pk_logo">
        <h2>Job Portal</h2>
      </div>

      {/* Menu */}
      <ul className="pk_nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/seeker">Jobseekers</Link>
        </li>

        <li>
          <Link to="/login">Employers</Link>
        </li>

        <li>
          <Link to="/admin">Admin</Link>
        </li>

        <li>
          <Link to="/">About Us</Link>
        </li>

        <li>
          <Link to="/contactt">Contact Us</Link>
        </li>
      </ul>

      {/* Profile */}
      <div className="pk_profile">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="profile"
        />
      </div>
    </nav>
  );
}