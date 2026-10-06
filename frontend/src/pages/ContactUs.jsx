import React, { useEffect, useState } from "react";
import {
  FiMail,
  FiPhone,
  FiFileText,
  FiType,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import "../css/contactus.css";

const API_URL = "https://latestjobportal.onrender.com";

export default function ContactUss() {
  const [formData, setFormData] = useState({
    pageTitle: "",
    email: "",
    mobileNumber: "",
    pageDescription: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    setLoading(true);
    setError("");

    // Pehle local cache dikha do
    try {
      const localData = localStorage.getItem("contactData");

      if (localData) {
        const parsedData = JSON.parse(localData);

        if (parsedData) {
          setFormData((prev) => ({
            ...prev,
            ...parsedData,
          }));
        }
      }
    } catch (error) {
      console.log("Local storage error:", error);
    }

    try {
      const res = await fetch(`${API_URL}/api/contact`);

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        const contactData = data.data || {};

        setFormData({
          pageTitle: contactData.pageTitle || "",
          email: contactData.email || "",
          mobileNumber: contactData.mobileNumber || "",
          pageDescription: contactData.pageDescription || "",
        });

        localStorage.setItem(
          "contactData",
          JSON.stringify(contactData)
        );
      } else {
        setError(data.message || "Unable to load contact details.");
      }
    } catch (error) {
      console.error("Fetch contact error:", error);

      setError(
        "Unable to connect with server. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);

    localStorage.setItem(
      "contactData",
      JSON.stringify(updatedData)
    );

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.pageTitle.trim()) {
      setError("Please enter page title.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter email address.");
      return;
    }

    if (!formData.mobileNumber.trim()) {
      setError("Please enter mobile number.");
      return;
    }

    if (!formData.pageDescription.trim()) {
      setError("Please enter page description.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to update contact details."
        );
      }

      if (data.success) {
        const updatedContact = data.data || formData;

        setFormData({
          pageTitle: updatedContact.pageTitle || "",
          email: updatedContact.email || "",
          mobileNumber: updatedContact.mobileNumber || "",
          pageDescription: updatedContact.pageDescription || "",
        });

        localStorage.setItem(
          "contactData",
          JSON.stringify(updatedContact)
        );

        setSuccess("Contact Us details updated successfully.");

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        setError(data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update contact error:", error);

      setError(
        error.message || "Something went wrong while updating."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="yy-contact-container">
      <div className="yy-contact-card">

        {/* Header */}
        <div className="yy-contact-header">
          <div className="yy-contact-header-icon">
            <FiPhone />
          </div>

          <div>
            <h2>Update Contact Us</h2>
            <p>Manage your website contact information</p>
          </div>
        </div>

        {/* Body */}
        <div className="yy-contact-body">

          {/* Error */}
          {error && (
            <div className="yy-message yy-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="yy-message yy-success">
              <FiCheckCircle />
              <span>{success}</span>
            </div>
          )}

          {loading ? (
            <div className="yy-loading">
              <div className="yy-spinner"></div>
              <p>Loading contact details...</p>
            </div>
          ) : (
            <form onSubmit={handleUpdate}>

              {/* Page Title */}
              <div className="yy-form-group">
                <label>
                  <FiType />
                  Page Title
                </label>

                <div className="yy-input-wrapper">
                  <FiType />
                  <input
                    type="text"
                    name="pageTitle"
                    className="yy-form-control"
                    placeholder="Enter page title"
                    value={formData.pageTitle}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="yy-form-group">
                <label>
                  <FiMail />
                  Email Address
                </label>

                <div className="yy-input-wrapper">
                  <FiMail />
                  <input
                    type="email"
                    name="email"
                    className="yy-form-control"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="yy-form-group">
                <label>
                  <FiPhone />
                  Mobile Number
                </label>

                <div className="yy-input-wrapper">
                  <FiPhone />
                  <input
                    type="text"
                    name="mobileNumber"
                    className="yy-form-control"
                    placeholder="Enter mobile number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="yy-form-group">
                <label>
                  <FiFileText />
                  Page Description
                </label>

                <div className="yy-textarea-wrapper">
                  <FiFileText />

                  <textarea
                    name="pageDescription"
                    className="yy-form-textarea"
                    placeholder="Enter contact page description"
                    value={formData.pageDescription}
                    onChange={handleChange}
                    rows="6"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="yy-update-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="yy-btn-spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Update Contact
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}