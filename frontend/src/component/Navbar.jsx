import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiShield,
  FiInfo,
  FiPhone,
  FiMenu,
  FiX,
  FiUser,
} from "react-icons/fi";
import "../css/navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="pk_navbar">
      {/* Logo */}
      <div className="pk_logo">
        <div className="pk_logo_icon">
          <FiBriefcase />
        </div>

        <div className="pk_logo_text">
          <h2>Job Portal</h2>
          <span>Build Your Career</span>
        </div>
      </div>

      {/* Desktop Menu */}
      <ul className={`pk_nav-links ${menuOpen ? "pk_menu-open" : ""}`}>
        <li>
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "pk_active" : "")}
          >
            <FiHome />
            <span>Home</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/seekerlogin"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "pk_active" : "")}
          >
            <FiUsers />
            <span>Jobseekers</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/login"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "pk_active" : "")}
          >
            <FiBriefcase />
            <span>Employers</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "pk_active" : "")}
          >
            <FiShield />
            <span>Admin</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/"
            onClick={closeMenu}
            className="pk_about_link"
          >
            <FiInfo />
            <span>About Us</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/contactpage"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "pk_active" : "")}
          >
            <FiPhone />
            <span>Contact Us</span>
          </NavLink>
        </li>
      </ul>

      {/* Profile */}
      <div className="pk_profile">
        <div className="pk_profile_circle">
          <FiUser />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="pk_menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>
    </nav>
  );
}