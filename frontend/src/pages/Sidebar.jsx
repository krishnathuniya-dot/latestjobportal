import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdDashboard, MdWorkOutline, MdOutlineFlashOn } from "react-icons/md";
import { FaUserTie, FaRegFileAlt, FaSearch, FaChevronRight } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi2";
import { PiRankingLight } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import "../css/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isJobCategoryOpen, setIsJobCategoryOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("DASHBOARDS");
  const [admin, setAdmin] = useState({ name: "", image: "" });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("http://localhost:2340/api/admin");
      const data = await res.json();
      if (data.success) {
        setAdmin(data.admin);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="top-logo">
        <span className="logo-icon">💧</span>
        <h2>JOBPORTAL</h2>
      </div>

      <div className="profile-box">
        <div className="profile-circle">
          {admin.image ? (
             <img
    src={`http://localhost:2340/uploads/admin/${admin.image}`}
    alt="Admin"
    onClick={() => navigate("/adminprofile")}
    style={{
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      objectFit: "cover",
      cursor: "pointer",
    }}
  />
) : (
  <HiOutlineUsers size={24} />
)}
        </div>
        <div className="profile-info">
          <span>{admin.name || "Loading..."}</span>
          <FiLogOut title="Logout" style={{ cursor: "pointer" }} />
        </div>
      </div>

      <ul className="menu">
        {/* DASHBOARDS */}
        <Link to="/dash">
          <li className={`nav-item ${activeMenu === "DASHBOARDS" ? "active" : ""}`} onClick={() => setActiveMenu("DASHBOARDS")}>
            <div className="menu-left"><MdDashboard /> <span>DASHBOARDS</span></div>
          </li>
        </Link>

        {/* JOB CATEGORY */}
        <li className={`nav-item ${activeMenu === "JOB_CATEGORY" ? "active" : ""}`} onClick={() => { setActiveMenu("JOB_CATEGORY"); setIsJobCategoryOpen(!isJobCategoryOpen); }}>
          <div className="menu-left"><MdWorkOutline /> <span>JOB CATEGORY</span></div>
          <FaChevronRight className={`arrow ${isJobCategoryOpen ? "rotate-arrow" : ""}`} />
        </li>

        {isJobCategoryOpen && (
          <>
            <Link to="/addcategory"><li className="sub-menu"><span>Add Category</span></li></Link>
            <Link to="/managecategory"><li className="sub-menu"><span>Manage Category</span></li></Link>
          </>
        )}

        {/* LIST OF EMPLOYERS */}
        <Link to="/employerlist">
          <li className={`nav-item ${activeMenu === "EMPLOYERS" ? "active" : ""}`} onClick={() => setActiveMenu("EMPLOYERS")}>
            <div className="menu-left"><MdOutlineFlashOn /> <span>LIST OF EMPLOYERS</span></div>
          </li>
        </Link>

        {/* REG JOBSEEKERS */}
        <Link to="/jobseekerlist">
          <li className={`nav-item ${activeMenu === "JOBSEEKERS" ? "active" : ""}`} onClick={() => setActiveMenu("JOBSEEKERS")}>
            <div className="menu-left"><FaUserTie /> <span>REG JOBSEEKERS</span></div>
          </li>
        </Link>

        {/* PAGES */}
        <Link to="/contact">
          <li className={`nav-item ${activeMenu === "PAGES" ? "active" : ""}`} onClick={() => setActiveMenu("PAGES")}>
            <div className="menu-left"><FaRegFileAlt /> <span>PAGES</span></div>
            <FaChevronRight className="arrow" />
          </li>
        </Link>

        {/* REPORTS */}
        <Link to="/date">
          <li className={`nav-item ${activeMenu === "REPORTS" ? "active" : ""}`} onClick={() => setActiveMenu("REPORTS")}>
            <div className="menu-left"><PiRankingLight /> <span>B/W DATES REPORT</span></div>
          </li>
        </Link>

        {/* SEARCH */}
        <Link to="">
          <li className={`nav-item ${activeMenu === "SEARCH" ? "active" : ""}`} onClick={() => setActiveMenu("SEARCH")}>
            <div className="menu-left"><FaSearch /> <span>SEARCH</span></div>
          </li>
        </Link>
      </ul>
    </div>
  );
}