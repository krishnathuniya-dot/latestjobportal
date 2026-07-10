import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/NNNavv.css";

const NNNavv = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 🎯 फिक्स 1: यूजर डेटा को स्टेट (State) में रखा ताकि बदलाव होने पर नवबार री-रेंडर हो सके
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // 🎯 फिक्स 2: लोकल स्टोरेज में बदलाव को लाइव ट्रैक करने के लिए useEffect
  useEffect(() => {
    const handleStorageChange = () => {
      // जैसे ही 'userUpdated' इवेंट मिलेगा, स्टेट अपडेट हो जाएगी और फोटो बदल जाएगी
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    // इवेंट लिसनर्स को ऑन किया
    window.addEventListener("userUpdated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange); // दूसरे टैब्स के लिए

    return () => {
      // कंपोनेंट अनमाउंट होने पर लिसनर्स को हटा दिया (मेमोरी लीक से बचने के लिए)
      window.removeEventListener("userUpdated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear(); 
    setDropdownOpen(false);
    alert("Logged out successfully");
    navigate("/seekerlogin");
  };

  // बाहर कहीं भी क्लिक करने पर ड्रॉपडाउन बंद करने का लॉजिक
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="hd-navbar">
      <div className="hd-logo">
        <h1>Job Portal</h1>
      </div>

      <ul className="hd-nav-links">
        <li><Link to="/hhome">Home</Link></li>
        <li><Link to="/applyjob">History of Applied Jobs</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>

      {/* प्रोफाइल और ड्रॉपडाउन कंटेनर */}
      <div className="hd-profile-container" ref={dropdownRef}>
        <div className="hd-profile" onClick={toggleDropdown} style={{ cursor: "pointer" }}>
          {/* 🎯 अब यहाँ इमेज बिना पेज रिफ्रेश किए तुरंत बदल जाएगी! */}
          {user?.profilePic ? (
            <img
              src={`http://localhost:2340/uploads/${user.profilePic}`}
              alt="Profile"
              className="nav-profile-img"
            />
          ) : (
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Profile"
              className="nav-profile-img"
            />
          )}
        </div>

        {dropdownOpen && (
          <div className="nav-dropdown-menu">
            <div className="dropdown-user-info">
              <h4>{user?.fullName || "User Name"}</h4>
              <p>{user?.email || "user@email.com"}</p>
            </div>
            <hr />
            <Link to="/home" className="dropdown-item" onClick={() => setDropdownOpen(false)}>👤 Profile</Link>
            <Link to="/editprofile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>✏️ Edit Profile</Link>
            <Link to="/change-password" className="dropdown-item" onClick={() => setDropdownOpen(false)}>🔑 Change Password</Link>
            <hr />
            <button className="dropdown-item logout-btn" onClick={handleLogout}>🚪 Log Out</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NNNavv;