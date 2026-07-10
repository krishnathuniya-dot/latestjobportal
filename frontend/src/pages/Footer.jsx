import React from "react";
import "../css/footer.css";

export default function Footer() {
  return (
    <div>

      {/* 🔵 Top Banner */}
      <div className="jp_banner">
        <div className="jp_banner_left">
          <h2>Better Results with Standardized Hiring Process</h2>
          <p>
            Your quality of hire increases when you treat everyone fairly and equally.
            Having multiple recruiters working on your hiring is beneficial.
          </p>
        </div>

        <button className="jp_banner_btn">
          GET REGISTERED & TRY NOW
        </button>
      </div>

      {/* ⚪ Footer */}
      <footer className="jp_footer">

        <div className="jp_footer_col">
          <h3>Job Portal</h3>
          <p>📞 +1234567890</p>
          <p>📧 info@gmail.com</p>
          <p>📍 D-204, Hole Town South West, Delhi-110096, India</p>
        </div>

        <div className="jp_footer_col">
          <h3>Quick Links</h3>
          <ul>
            <li>About</li>
            <li>Contact</li>
            <li>Home</li>
            <li>Admin</li>
            <li>Jobseeker</li>
            <li>Employer</li>
          </ul>
        </div>

        <div className="jp_footer_col">
          <h3>Job Category</h3>
          <ul>
            <li>Digital Marketing</li>
            <li>HR</li>
            <li>IT</li>
            <li>Operations</li>
            <li>Product Manager</li>
          </ul>
        </div>

      </footer>
    </div>
  );
}