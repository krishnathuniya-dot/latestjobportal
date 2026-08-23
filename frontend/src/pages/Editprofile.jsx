import React, { useEffect, useState } from "react";
import "../css/editprofile.css";

const Editprofile = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    summary: "",
    skills: "",
    profilePic: "",
    resume: "",
  });

  const [image, setImage] = useState(null);

  // Safely get stored user to prevent crashes if localStorage is empty
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchProfile = async () => {
      if (!storedUser._id) return;
      try {
        const response = await fetch(
          `https://latestjobportal-11.onrender.com/api/profile/${storedUser._id}`
        );
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Handle Text Inputs Change
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Profile Image Change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("fullName", user.fullName);
      formData.append("email", user.email);
      formData.append("contactNumber", user.contactNumber);
      formData.append("summary", user.summary);
      formData.append("skills", user.skills);

      if (image) {
        formData.append("profilePic", image);
      }

      if (user.resume instanceof File) {
        formData.append("resume", user.resume);
      }

      const response = await fetch(
        `https://latestjobportal-11.onrender.com/api/update-profile/${user._id || storedUser._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setImage(null);
        alert("Profile Updated Successfully!");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert("Update Failed");
    }
  };

  return (
    <div className="edit-profile-container">
      {/* Form Header */}
      <div className="edit-profile-header">
        <h1 className="edit-profile-title">User Account Details</h1>
      </div>

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        
        {/* Profile Image Preview & Upload Section */}
        <div className="edit-profile-image-section">
          <img
            className="edit-profile-image"
            src={
              image
                ? URL.createObjectURL(image)
                : user.profilePic
                ? `https://latestjobportal-11.onrender.com/uploads/${user.profilePic}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Profile Preview"
          />
          <p className="edit-profile-change-pic">Change Profile Pic</p>
          <input
            className="edit-profile-file-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Row 1: Name + Email */}
        <div className="edit-profile-row">
          <div className="edit-profile-group">
            <label className="edit-profile-label">Full Name *</label>
            <input
              className="edit-profile-input"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={user.fullName || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="edit-profile-group">
            <label className="edit-profile-label">Your Email *</label>
            <input
              className="edit-profile-input"
              type="email"
              name="email"
              placeholder="johndoe@example.com"
              value={user.email || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 2: Contact + Skills */}
        <div className="edit-profile-row">
          <div className="edit-profile-group">
            <label className="edit-profile-label">Contact Number</label>
            <input
              className="edit-profile-input"
              type="text"
              name="contactNumber"
              placeholder="+1 234 567 890"
              value={user.contactNumber || ""}
              onChange={handleChange}
            />
          </div>

          <div className="edit-profile-group">
            <label className="edit-profile-label">Skills</label>
            <input
              className="edit-profile-input"
              type="text"
              name="skills"
              placeholder="React, Node.js, CSS"
              value={user.skills || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Resume Section */}
        <div className="edit-profile-group">
          <label className="edit-profile-label">Resume (PDF)</label>
          {user.resume && typeof user.resume === "string" && (
            <a
              href={`https://latestjobportal-11.onrender.com/uploads/${user.resume}`}
              target="_blank"
              rel="noreferrer"
              className="edit-profile-resume-link"
            >
              📄 View Current Resume
            </a>
          )}
          <input
            className="edit-profile-file-input"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setUser({ ...user, resume: e.target.files[0] })
            }
          />
        </div>

        {/* About Me / Summary */}
        <div className="edit-profile-group">
          <label className="edit-profile-label">About Me</label>
          <textarea
            className="edit-profile-textarea"
            name="summary"
            placeholder="Write a brief summary about yourself..."
            value={user.summary || ""}
            onChange={handleChange}
          />
        </div>

        {/* Action Button */}
        <button type="submit" className="edit-profile-update-btn">
          Save & Update Profile
        </button>
      </form>
    </div>
  );
};

export default Editprofile;