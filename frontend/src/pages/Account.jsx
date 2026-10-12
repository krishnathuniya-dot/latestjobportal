
import React, { useEffect, useState } from "react";
import "../css/aaccount.css";

const API_URL = "https://latestjobportal.onrender.com";

const initialFormData = {
  personName: "",
  email: "",
  companyName: "",
  tagline: "",
  description: "",
  website: "",
  noOfEmployees: "",
  industry: "",
  businessType: "",
  location: "",
  established: "",
  logo: "",
};

export default function Account() {
  const [formData, setFormData] = useState(initialFormData);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // FETCH USER PROFILE
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("User");

        if (!storedUser) return;

        const user = JSON.parse(storedUser);

        if (!user?._id) return;

        const response = await fetch(
          `${API_URL}/api/user/${user._id}`
        );

        const result = await response.json();

        if (!response.ok || !result.user) {
          console.error("Fetch profile failed:", result.message);
          return;
        }

        const userData = result.user;

        setFormData({
          personName: userData.personName || "",
          email: userData.email || "",
          companyName: userData.companyName || "",
          tagline: userData.tagline || "",
          description: userData.description || "",
          website: userData.website || "",
          noOfEmployees: userData.noOfEmployees ?? "",
          industry: userData.industry || "",
          businessType: userData.businessType || "",
          location: userData.location || "",
          established: userData.established || "",
          logo: userData.logo || "",
        });

        localStorage.setItem("User", JSON.stringify(userData));
      } catch (error) {
        console.error("Fetch user error:", error);
      }
    };

    fetchUser();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // LOGO PREVIEW
  const handleLogo = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setLogoFile(file);

    // Local preview only; backend upload happens on submit.
    const previewUrl = URL.createObjectURL(file);

    setFormData((previous) => ({
      ...previous,
      logo: previewUrl,
    }));
  };

  // UPDATE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedUser = localStorage.getItem("User");

      if (!storedUser) {
        alert("Please log in again.");
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user?._id) {
        alert("User not found. Please log in again.");
        return;
      }

      setLoading(true);

      const dataToSend = new FormData();

      dataToSend.append("personName", formData.personName);
      dataToSend.append("email", formData.email);
      dataToSend.append("companyName", formData.companyName);
      dataToSend.append("tagline", formData.tagline);
      dataToSend.append("description", formData.description);
      dataToSend.append("website", formData.website);
      dataToSend.append("noOfEmployees", formData.noOfEmployees);
      dataToSend.append("industry", formData.industry);
      dataToSend.append("businessType", formData.businessType);
      dataToSend.append("location", formData.location);
      dataToSend.append("established", formData.established);

      // Field name must match upload.single("logo") in backend.
      if (logoFile) {
        dataToSend.append("logo", logoFile);
      }

      const response = await fetch(
        `${API_URL}/api/update/${user._id}`,
        {
          method: "PUT",
          body: dataToSend,
        }
      );

      const result = await response.json();

      console.log("UPDATE RESPONSE:", result);

      if (!response.ok || !result.success) {
        alert(result.message || "Profile update failed.");
        return;
      }

      const updatedUser = result.user;

      setFormData({
        personName: updatedUser.personName || "",
        email: updatedUser.email || "",
        companyName: updatedUser.companyName || "",
        tagline: updatedUser.tagline || "",
        description: updatedUser.description || "",
        website: updatedUser.website || "",
        noOfEmployees: updatedUser.noOfEmployees ?? "",
        industry: updatedUser.industry || "",
        businessType: updatedUser.businessType || "",
        location: updatedUser.location || "",
        established: updatedUser.established || "",
        logo: updatedUser.logo || "",
      });

      localStorage.setItem("User", JSON.stringify(updatedUser));
      setLogoFile(null);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Unable to update profile. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // CLOUDINARY URL OR LEGACY LOCAL IMAGE
  const getLogoUrl = () => {
    if (!formData.logo) return "";

    // New Cloudinary URL
    if (formData.logo.startsWith("https://")) {
      return formData.logo;
    }

    // Legacy local filename from old records
    return `${API_URL}/uploads/${formData.logo}`;
  };

  return (
    <div className="jk_account_container">
      <form className="jk_account_form" onSubmit={handleSubmit}>
        <div className="jk_grid">
          <div className="jk_input_box">
            <label>Person Name *</label>
            <input
              type="text"
              name="personName"
              placeholder="Enter Name"
              value={formData.personName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="jk_input_box">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="jk_input_box">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter Company Name"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          <div className="jk_input_box">
            <label>Tagline</label>
            <input
              type="text"
              name="tagline"
              placeholder="Enter Tagline"
              value={formData.tagline}
              onChange={handleChange}
            />
          </div>

          <div className="jk_input_box jk_full_width">
            <label>Description</label>

            <div className="jk_editor_mock">
              <div className="jk_editor_toolbar">
                <span className="jk_tool_btn"><b>B</b></span>
                <span className="jk_tool_btn"><i>I</i></span>
                <span className="jk_tool_btn"><u>U</u></span>
                <span className="jk_tool_select">Font Size</span>
                <span className="jk_tool_select">Font Family</span>
                <span className="jk_tool_select">Font Format</span>
              </div>

              <textarea
                name="description"
                placeholder="Enter company description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />
            </div>
          </div>

          <div className="jk_input_box">
            <label>Website</label>
            <input
              type="text"
              name="website"
              placeholder="https://company.com"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="jk_input_box">
            <label>No. of Employees</label>
            <input
              type="number"
              name="noOfEmployees"
              placeholder="e.g. 105"
              value={formData.noOfEmployees}
              onChange={handleChange}
            />
          </div>

          <div className="jk_input_box">
            <label>Industry</label>
            <input
              type="text"
              name="industry"
              placeholder="e.g. Insurance"
              value={formData.industry}
              onChange={handleChange}
            />
          </div>

          <div className="jk_input_box">
            <label>Type of Business Entity</label>
            <input
              type="text"
              name="businessType"
              placeholder="e.g. Pvt Ltd"
              value={formData.businessType}
              onChange={handleChange}
            />
          </div>

          <div className="jk_input_box">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. New Delhi"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="jk_input_box">
            <label>Established In</label>
            <input
              type="text"
              name="established"
              placeholder="e.g. 14 Sept 2018"
              value={formData.established}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* COMPANY LOGO */}
        <div className="jk_logo_section">
          <label className="jk_logo_title">Company Logo</label>

          <div className="jk_logo_box">
            {formData.logo ? (
              <img
                src={getLogoUrl()}
                alt="Company logo"
                className="pk_logo_img"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                  console.error("Company logo failed to load.");
                }}
              />
            ) : (
              <div className="jk_logo_placeholder">
                No logo uploaded
              </div>
            )}
          </div>

          <label className="jk_change_btn">
            Change Logo
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png,image/webp"
              onChange={handleLogo}
            />
          </label>
        </div>

        <button
          type="submit"
          className="jk_update_btn"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
