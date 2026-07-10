import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Jobs.css";

export default function Jobs() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showJobsMenu, setShowJobsMenu] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="ff_navbar">

      {/* Logo */}
      <div className="ff_logo">
        Job Portal
      </div>

      {/* Menu */}
      <ul className="ff_nav_links">
        <li
          className="ff_jobs_menu"
          onClick={() =>
            setShowJobsMenu(!showJobsMenu)
          }
        >
          Jobs ▼

          {showJobsMenu && (
            <div className="ff_jobs_dropdown">
              <Link
                to="/postjob"
                className="ff_jobs_item"
              >
                📝 Post Job
              </Link>

              <Link
                to="/search"
                className="ff_jobs_item"
              >
                📋 Jobs
              </Link>

              <Link
                to="/managejob"
                className="ff_jobs_item"
              >
                📋 Manage Jobs
              </Link>
            </div>
          )}
        </li>

        <li>
          <Link to="/list">
            Candidates List
          </Link>
        </li>

        <li>Reports</li>
      </ul>

      {/* User Section */}
      <div
        className="ff_user_section"
        ref={menuRef}
      >
        {user?.logo ? (
          <img
            src={`http://localhost:2340/uploads/${user.logo}`}
            alt="logo"
            className="ff_company_logo"
            onClick={() =>
              setShowMenu((prev) => !prev)
            }
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div
            className="ff_default_logo"
            onClick={() =>
              setShowMenu((prev) => !prev)
            }
          >
            U
          </div>
        )}

        {/* Dropdown */}
        {showMenu && (
          <div className="ff_dropdown_menu">
            <p className="ff_user_name">
              {user?.companyName ||
                user?.personName ||
                "User"}
            </p>

            <hr />

            <Link
              to="/account"
              className="ff_dropdown_item"
            >
              My Account
            </Link>

            <button className="ff_dropdown_item">
              Change Password
            </button>

            <button
              className="ff_dropdown_item ff_logout_btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

    </nav>
  );
}