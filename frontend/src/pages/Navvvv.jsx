// 📂 Navvvv.jsx

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiBriefcase,
  FiHome,
  FiUsers,
  FiBarChart2,
  FiMenu,
  FiX,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";

import "../css/navvvv.css";

export default function Navvvv() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="kl_navbar">

      {/* Logo */}
      <NavLink to="/" className="kl_logo" onClick={closeMenu}>
        <span className="kl_logo_icon">
          <FiBriefcase />
        </span>

        <span>
          Job<span>Portal</span>
        </span>
      </NavLink>

      {/* Desktop / Mobile Menu */}
      <nav className={`kl_menu ${menuOpen ? "kl_menu_open" : ""}`}>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `kl_link ${isActive ? "kl_active" : ""}`
          }
          onClick={closeMenu}
        >
          <FiHome />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            `kl_link ${isActive ? "kl_active" : ""}`
          }
          onClick={closeMenu}
        >
          <FiBriefcase />
          <span>Jobs</span>
        </NavLink>

        <NavLink
          to="/candidates"
          className={({ isActive }) =>
            `kl_link ${isActive ? "kl_active" : ""}`
          }
          onClick={closeMenu}
        >
          <FiUsers />
          <span>Candidates</span>
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `kl_link ${isActive ? "kl_active" : ""}`
          }
          onClick={closeMenu}
        >
          <FiBarChart2 />
          <span>Reports</span>
        </NavLink>

        {/* Mobile Auth Buttons */}
        <div className="kl_mobile_auth">

          <NavLink
            to="/login"
            className="kl_login_btn"
            onClick={closeMenu}
          >
            <FiLogIn />
            Login
          </NavLink>

          <NavLink
            to="/register"
            className="kl_register_btn"
            onClick={closeMenu}
          >
            <FiUserPlus />
            Register
          </NavLink>

        </div>
      </nav>

      {/* Desktop Auth Buttons */}
      <div className="kl_auth">

        <NavLink to="/login" className="kl_login_btn">
          <FiLogIn />
          Login
        </NavLink>

        <NavLink to="/register" className="kl_register_btn">
          <FiUserPlus />
          Register
        </NavLink>

      </div>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="kl_menu_btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

    </header>
  );
}