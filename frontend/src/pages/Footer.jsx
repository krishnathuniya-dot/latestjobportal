import React from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="jp_footer_wrapper">

      {/* ================= TOP CTA ================= */}
      <section className="jp_banner">
        <div className="jp_banner_content">
          <div className="jp_banner_left">
            <span className="jp_banner_tag">
              🚀 Build Your Career
            </span>

            <h2>
              Better Results with a
              <span> Standardized Hiring Process</span>
            </h2>

            <p>
              Find the right opportunities and connect with the right
              talent. Make your hiring and job search journey faster,
              easier and more effective.
            </p>
          </div>

          <Link to="/register" className="jp_banner_btn">
            GET REGISTERED
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* ================= MAIN FOOTER ================= */}
      <footer className="jp_footer">

        <div className="jp_footer_container">

          {/* BRAND */}
          <div className="jp_footer_brand">

            <Link to="/" className="jp_footer_logo">
              <span className="jp_logo_icon">JP</span>
              <span>Job Portal</span>
            </Link>

            <p className="jp_footer_description">
              Your trusted platform for finding the right job and
              connecting talented professionals with great companies.
            </p>

            <div className="jp_contact_list">

              <a href="tel:+1234567890">
                <span className="jp_contact_icon">📞</span>
                <span>+91 12345 67890</span>
              </a>

              <a href="mailto:info@gmail.com">
                <span className="jp_contact_icon">✉️</span>
                <span>info@gmail.com</span>
              </a>

              <div>
                <span className="jp_contact_icon">📍</span>
                <span>
                  D-204, Hole Town South West,
                  Delhi-110096, India
                </span>
              </div>

            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="jp_footer_col">
            <h3>Quick Links</h3>

            <ul>
              <li>
                <Link to="/">
                  <span>→</span> Home
                </Link>
              </li>

              <li>
                <Link to="/about">
                  <span>→</span> About Us
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  <span>→</span> Contact
                </Link>
              </li>

              <li>
                <Link to="/jobs">
                  <span>→</span> Find Jobs
                </Link>
              </li>

              <li>
                <Link to="/register">
                  <span>→</span> Jobseeker
                </Link>
              </li>

              <li>
                <Link to="/employer">
                  <span>→</span> Employer
                </Link>
              </li>
            </ul>
          </div>

          {/* JOB CATEGORIES */}
          <div className="jp_footer_col">
            <h3>Job Categories</h3>

            <ul>
              <li>
                <Link to="/category/IT">
                  <span>→</span> IT Jobs
                </Link>
              </li>

              <li>
                <Link to="/category/Marketing">
                  <span>→</span> Marketing
                </Link>
              </li>

              <li>
                <Link to="/category/Design">
                  <span>→</span> Design
                </Link>
              </li>

              <li>
                <Link to="/category/Operations">
                  <span>→</span> Operations
                </Link>
              </li>

              <li>
                <Link to="/category/Product%20Manager">
                  <span>→</span> Product Manager
                </Link>
              </li>

              <li>
                <Link to="/category/Software%20Developer">
                  <span>→</span> Software Developer
                </Link>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER / SOCIAL */}
          <div className="jp_footer_col jp_footer_newsletter">

            <h3>Stay Connected</h3>

            <p>
              Get the latest job opportunities and career updates
              directly in your inbox.
            </p>

            <div className="jp_social_links">

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                in
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                ◎
              </a>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                f
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                𝕏
              </a>

            </div>

            <Link to="/jobs" className="jp_footer_jobs_btn">
              Explore Jobs
              <span>→</span>
            </Link>

          </div>

        </div>

        {/* ================= BOTTOM ================= */}
        <div className="jp_footer_bottom">

          <div className="jp_footer_bottom_inner">

            <p>
              © {currentYear} Job Portal. All rights reserved.
            </p>

            <div className="jp_footer_bottom_links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms & Conditions</Link>
            </div>

          </div>

        </div>

      </footer>
    </footer>
  );
}