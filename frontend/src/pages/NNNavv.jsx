import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiClock,
  FiInfo,
  FiPhone,
  FiUser,
  FiEdit3,
  FiLock,
  FiLogOut,
  FiChevronDown,
  FiMenu,
  FiX,
  FiBriefcase,
} from "react-icons/fi";

import "../css/NNNavv.css";

const DEFAULT_PROFILE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const NNNavv = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  /* =========================================
     USER DATA
  ========================================= */

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  /* =========================================
     LIVE USER UPDATE
  ========================================= */

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedUser = localStorage.getItem("user");
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch (error) {
        setUser(null);
      }
    };

    window.addEventListener("userUpdated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userUpdated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  /* =========================================
     OUTSIDE CLICK
  ========================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================================
     PROFILE IMAGE
  ========================================= */

  const profileImage = user?.profilePic
    ? `https://latestjobportal.onrender.com/uploads/${user.profilePic}`
    : DEFAULT_PROFILE;

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    localStorage.clear();

    setUser(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);

    alert("Logged out successfully");

    navigate("/seekerlogin");
  };

  /* =========================================
     CLOSE MENU
  ========================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  /* =========================================
     PROFILE IMAGE ERROR
  ========================================= */

  const handleImageError = (e) => {
    e.currentTarget.src = DEFAULT_PROFILE;
  };

  return (
    <nav className="hd-navbar">

      {/* =====================================
          LOGO
      ===================================== */}

      <Link
        to="/hhome"
        className="hd-logo"
        onClick={closeMobileMenu}
      >
        <span className="hd-logo-icon">
          <FiBriefcase />
        </span>

        <span className="hd-logo-text">
          Job<span>Portal</span>
        </span>
      </Link>


      {/* =====================================
          NAVIGATION
      ===================================== */}

      <ul
        className={`hd-nav-links ${
          mobileMenuOpen ? "hd-mobile-open" : ""
        }`}
      >

        <li>
          <NavLink
            to="/hhome"
            className={({ isActive }) =>
              `hd-nav-link ${isActive ? "hd-active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            <FiHome />
            <span>Home</span>
          </NavLink>
        </li>


        <li>
          <NavLink
            to="/applyjob"
            className={({ isActive }) =>
              `hd-nav-link ${isActive ? "hd-active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            <FiClock />
            <span>Applied Jobs</span>
          </NavLink>
        </li>


        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hd-nav-link ${isActive ? "hd-active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            <FiInfo />
            <span>About Us</span>
          </NavLink>
        </li>


        <li>
          <NavLink
            to="/contactpage"
            className={({ isActive }) =>
              `hd-nav-link ${isActive ? "hd-active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            <FiPhone />
            <span>Contact Us</span>
          </NavLink>
        </li>


        {/* =================================
            MOBILE PROFILE MENU
        ================================= */}

        <li className="hd-mobile-profile">

          <div className="hd-mobile-user">

            <img
              src={profileImage}
              alt="Profile"
              className="hd-mobile-profile-img"
              onError={handleImageError}
            />

            <div>
              <strong>
                {user?.fullName || "User Name"}
              </strong>

              <small>
                {user?.email || "user@email.com"}
              </small>
            </div>

          </div>


          <Link
            to="/home"
            onClick={closeMobileMenu}
          >
            <FiUser />
            Profile
          </Link>


          <Link
            to="/editprofile"
            onClick={closeMobileMenu}
          >
            <FiEdit3 />
            Edit Profile
          </Link>


          <Link
            to="/change-password"
            onClick={closeMobileMenu}
          >
            <FiLock />
            Change Password
          </Link>


          <button
            type="button"
            className="hd-mobile-logout"
            onClick={handleLogout}
          >
            <FiLogOut />
            Log Out
          </button>

        </li>

      </ul>


      {/* =====================================
          DESKTOP PROFILE
      ===================================== */}

      <div
        className="hd-profile-container"
        ref={dropdownRef}
      >

        <button
          type="button"
          className="hd-profile"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >

          <img
            src={profileImage}
            alt="Profile"
            className="nav-profile-img"
            onError={handleImageError}
          />

          <span className="hd-profile-name">
            {user?.fullName
              ? user.fullName.split(" ")[0]
              : "Profile"}
          </span>

          <FiChevronDown
            className={`hd-profile-arrow ${
              dropdownOpen ? "hd-arrow-open" : ""
            }`}
          />

        </button>


        {/* =================================
            DROPDOWN
        ================================= */}

        {dropdownOpen && (

          <div className="nav-dropdown-menu">

            <div className="dropdown-user-info">

              <img
                src={profileImage}
                alt="Profile"
                className="dropdown-profile-img"
                onError={handleImageError}
              />

              <div>
                <h4>
                  {user?.fullName || "User Name"}
                </h4>

                <p>
                  {user?.email || "user@email.com"}
                </p>
              </div>

            </div>


            <hr />


            <Link
              to="/home"
              className="dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              <span className="dropdown-icon">
                <FiUser />
              </span>

              Profile
            </Link>


            <Link
              to="/editprofile"
              className="dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              <span className="dropdown-icon">
                <FiEdit3 />
              </span>

              Edit Profile
            </Link>


            <Link
              to="/change-password"
              className="dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              <span className="dropdown-icon">
                <FiLock />
              </span>

              Change Password
            </Link>


            <hr />


            <button
              type="button"
              className="dropdown-item logout-btn"
              onClick={handleLogout}
            >
              <span className="dropdown-icon logout-icon">
                <FiLogOut />
              </span>

              Log Out
            </button>

          </div>

        )}

      </div>


      {/* =====================================
          MOBILE BUTTON
      ===================================== */}

      <button
        type="button"
        className="hd-menu-button"
        onClick={() => {
          setMobileMenuOpen(!mobileMenuOpen);
          setDropdownOpen(false);
        }}
        aria-label="Toggle navigation"
      >
        {mobileMenuOpen ? <FiX /> : <FiMenu />}
      </button>

    </nav>
  );
};

export default NNNavv;