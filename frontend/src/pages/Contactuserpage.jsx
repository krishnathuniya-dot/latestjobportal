import React, { useEffect, useState } from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiRefreshCw,
} from "react-icons/fi";
import "../css/ContactPage.css";

const API_URL = "https://latestjobportal.onrender.com";

export default function ContactuserPage() {
  const [contact, setContact] = useState({
    pageTitle: "",
    email: "",
    mobileNumber: "",
    pageDescription: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContact = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/contact`);

      if (!response.ok) {
        throw new Error("Contact details fetch nahi ho paayi.");
      }

      const data = await response.json();

      if (data.success) {
        setContact({
          pageTitle: data.data?.pageTitle || "Contact Us",
          email: data.data?.email || "",
          mobileNumber: data.data?.mobileNumber || "",
          pageDescription: data.data?.pageDescription || "",
        });
      } else {
        setError(data.message || "Contact details available nahi hain.");
      }
    } catch (err) {
      console.error("Contact API Error:", err);
      setError("Unable to load contact details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  if (loading) {
    return (
      <div className="contact-user-loading">
        <div className="contact-user-spinner"></div>
        <p>Loading contact details...</p>
      </div>
    );
  }

  return (
    <div className="contact-user-page">

      {/* Hero */}
      <section className="contact-user-hero">
        <div className="contact-user-hero-content">
          <span className="contact-user-badge">
            <FiMessageCircle />
            GET IN TOUCH
          </span>

          <h1>
            {contact.pageTitle || "Contact Us"}
          </h1>

          <p>
            {contact.pageDescription ||
              "Have any questions? Feel free to contact us."}
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-user-content">

        {error && (
          <div className="contact-user-error">
            <span>{error}</span>

            <button onClick={fetchContact}>
              <FiRefreshCw />
              Retry
            </button>
          </div>
        )}

        <div className="contact-user-grid">

          {/* Phone */}
          <a
            href={
              contact.mobileNumber
                ? `tel:${contact.mobileNumber}`
                : "#"
            }
            className="contact-user-card"
          >
            <div className="contact-user-icon phone-icon">
              <FiPhone />
            </div>

            <div>
              <span>Call Us</span>

              <h3>
                {contact.mobileNumber || "Not Available"}
              </h3>

              <p>
                Contact us directly on our mobile number.
              </p>
            </div>
          </a>

          {/* Email */}
          <a
            href={
              contact.email
                ? `mailto:${contact.email}`
                : "#"
            }
            className="contact-user-card"
          >
            <div className="contact-user-icon email-icon">
              <FiMail />
            </div>

            <div>
              <span>Email Us</span>

              <h3>
                {contact.email || "Not Available"}
              </h3>

              <p>
                Send us an email for your queries.
              </p>
            </div>
          </a>

          {/* Information */}
          <div className="contact-user-card">
            <div className="contact-user-icon location-icon">
              <FiMapPin />
            </div>

            <div>
              <span>Information</span>

              <h3>Get In Touch</h3>

              <p>
                {contact.pageDescription ||
                  "For more information, please contact us."}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Contact Section */}
        <div className="contact-user-bottom">

          <div className="contact-user-bottom-content">

            <span className="contact-user-small-title">
              WE ARE HERE TO HELP
            </span>

            <h2>
              Have Any Questions?
            </h2>

            <p>
              {contact.pageDescription ||
                "Our team is always available to help you. Contact us using the details below."}
            </p>

            <div className="contact-user-details">

              {contact.mobileNumber && (
                <a
                  href={`tel:${contact.mobileNumber}`}
                  className="contact-user-detail"
                >
                  <FiPhone />

                  <div>
                    <small>Phone Number</small>
                    <strong>
                      {contact.mobileNumber}
                    </strong>
                  </div>
                </a>
              )}

              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="contact-user-detail"
                >
                  <FiMail />

                  <div>
                    <small>Email Address</small>
                    <strong>
                      {contact.email}
                    </strong>
                  </div>
                </a>
              )}

            </div>
          </div>

          <div className="contact-user-help">
            <FiMessageCircle />

            <h3>Need Help?</h3>

            <p>
              We are happy to assist you.
            </p>

            {contact.email && (
              <a href={`mailto:${contact.email}`}>
                Email Us
                <FiMail />
              </a>
            )}
          </div>

        </div>

      </section>
    </div>
  );
}