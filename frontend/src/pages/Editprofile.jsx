import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCode,
  FiFileText,
  FiUpload,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
  FiExternalLink,
} from "react-icons/fi";
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
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchProfile = async () => {
      if (!storedUser._id) {
        setIsLoading(false);

        setMessage({
          type: "error",
          text: "Please login first to edit your profile.",
        });

        return;
      }

      try {
        const response = await fetch(
          `https://latestjobportal.onrender.com/api/profile/${storedUser._id}`
        );

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        } else {
          setMessage({
            type: "error",
            text: data.message || "Unable to load profile.",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);

        setMessage({
          type: "error",
          text: "Unable to load your profile.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];

    if (!selectedImage) return;

    if (!selectedImage.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select a valid image file.",
      });
      return;
    }

    setImage(selectedImage);

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);

    setMessage({
      type: "",
      text: "",
    });
  };

  const handleResumeChange = (e) => {
    const selectedResume = e.target.files?.[0];

    if (!selectedResume) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const fileExtension = selectedResume.name
      .split(".")
      .pop()
      .toLowerCase();

    const allowedExtensions = ["pdf", "doc", "docx"];

    if (
      !allowedTypes.includes(selectedResume.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      setMessage({
        type: "error",
        text: "Please upload PDF, DOC or DOCX resume.",
      });
      return;
    }

    if (selectedResume.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Resume size should be less than 5MB.",
      });
      return;
    }

    setUser((prev) => ({
      ...prev,
      resume: selectedResume,
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.fullName?.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your full name.",
      });
      return;
    }

    if (!user.email?.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your email.",
      });
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();

      formData.append("fullName", user.fullName);
      formData.append("email", user.email);
      formData.append("contactNumber", user.contactNumber || "");
      formData.append("summary", user.summary || "");
      formData.append("skills", user.skills || "");

      if (image) {
        formData.append("profilePic", image);
      }

      if (user.resume instanceof File) {
        formData.append("resume", user.resume);
      }

      const userId = user._id || storedUser._id;

      const response = await fetch(
        `https://latestjobportal.onrender.com/api/update-profile/${userId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setUser(data.user);
        setImage(null);
        setImagePreview("");

        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Update Error:", error);

      setMessage({
        type: "error",
        text: "Profile update failed. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const profileImage = imagePreview
    ? imagePreview
    : user.profilePic
    ? `https://latestjobportal.onrender.com/uploads/${user.profilePic}`
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  if (isLoading) {
    return (
      <div className="edit-profile-loading">
        <div className="edit-profile-loader"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">

      {/* Header */}
      <div className="edit-profile-header">
        <div className="edit-profile-header-inner">
          <div className="edit-profile-header-icon">
            <FiUser />
          </div>

          <div>
            <span className="edit-profile-header-small">
              ACCOUNT SETTINGS
            </span>

            <h1>Edit Profile</h1>

            <p>
              Keep your professional information up to date.
            </p>
          </div>
        </div>
      </div>

      <div className="edit-profile-wrapper">

        {/* Message */}
        {message.text && (
          <div
            className={`edit-profile-message ${
              message.type === "success"
                ? "edit-profile-success"
                : "edit-profile-error"
            }`}
          >
            {message.type === "success" ? (
              <FiCheckCircle />
            ) : (
              <FiAlertCircle />
            )}

            <span>{message.text}</span>
          </div>
        )}

        <form
          className="edit-profile-card"
          onSubmit={handleSubmit}
        >

          {/* Profile Top */}
          <div className="edit-profile-top">

            <div className="edit-profile-photo-area">
              <div className="edit-profile-photo-wrapper">
                <img
                  className="edit-profile-image"
                  src={profileImage}
                  alt="Profile Preview"
                />

                <label
                  htmlFor="profile-image"
                  className="edit-profile-camera"
                  title="Change profile picture"
                >
                  <FiUpload />
                </label>

                <input
                  id="profile-image"
                  className="edit-profile-hidden-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <h3>{user.fullName || "Your Name"}</h3>

              <p>
                {user.email || "Your email"}
              </p>

              <label
                htmlFor="profile-image"
                className="edit-profile-change-photo"
              >
                Change Profile Picture
              </label>
            </div>

            <div className="edit-profile-top-info">
              <div className="edit-profile-info-icon">
                <FiFileText />
              </div>

              <div>
                <h2>Personal Information</h2>

                <p>
                  Update your personal and professional details
                  so employers can learn more about you.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="edit-profile-divider"></div>

          {/* Personal Information */}
          <div className="edit-profile-section">
            <div className="edit-profile-section-heading">
              <span>01</span>

              <div>
                <h3>Basic Information</h3>
                <p>
                  Your basic contact information
                </p>
              </div>
            </div>

            <div className="edit-profile-grid">

              {/* Full Name */}
              <div className="edit-profile-group">
                <label>
                  <FiUser />
                  Full Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={user.fullName || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="edit-profile-group">
                <label>
                  <FiMail />
                  Email Address <span>*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={user.email || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Contact */}
              <div className="edit-profile-group">
                <label>
                  <FiPhone />
                  Contact Number
                </label>

                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Enter your contact number"
                  value={user.contactNumber || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Skills */}
              <div className="edit-profile-group">
                <label>
                  <FiCode />
                  Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  placeholder="React, Node.js, MongoDB, CSS"
                  value={user.skills || ""}
                  onChange={handleChange}
                />

                <small>
                  Add your skills separated by commas.
                </small>
              </div>
            </div>
          </div>

          {/* Professional Section */}
          <div className="edit-profile-section">

            <div className="edit-profile-section-heading">
              <span>02</span>

              <div>
                <h3>Professional Profile</h3>
                <p>
                  Tell employers about yourself
                </p>
              </div>
            </div>

            <div className="edit-profile-group">
              <label>
                <FiFileText />
                About Me
              </label>

              <textarea
                name="summary"
                placeholder="Write a brief professional summary about yourself..."
                value={user.summary || ""}
                onChange={handleChange}
                rows="6"
              ></textarea>

              <small>
                A good summary helps employers understand your
                experience and career goals.
              </small>
            </div>
          </div>

          {/* Resume Section */}
          <div className="edit-profile-section">

            <div className="edit-profile-section-heading">
              <span>03</span>

              <div>
                <h3>Resume</h3>
                <p>
                  Upload your latest resume
                </p>
              </div>
            </div>

            <div className="edit-profile-resume-box">

              <div className="edit-profile-resume-icon">
                <FiFileText />
              </div>

              <div className="edit-profile-resume-content">

                {user.resume &&
                typeof user.resume === "string" ? (
                  <>
                    <strong>
                      Current Resume
                    </strong>

                    <a
                      href={`https://latestjobportal.onrender.com/uploads/${user.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="edit-profile-resume-link"
                    >
                      <FiExternalLink />
                      View Current Resume
                    </a>
                  </>
                ) : user.resume instanceof File ? (
                  <>
                    <strong>
                      {user.resume.name}
                    </strong>

                    <span>
                      New resume selected
                    </span>
                  </>
                ) : (
                  <>
                    <strong>
                      No resume uploaded
                    </strong>

                    <span>
                      PDF, DOC or DOCX up to 5MB
                    </span>
                  </>
                )}

              </div>

              <label
                htmlFor="resume-upload"
                className="edit-profile-resume-btn"
              >
                <FiUpload />
                Choose File
              </label>

              <input
                id="resume-upload"
                className="edit-profile-hidden-file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
              />
            </div>
          </div>

          {/* Bottom */}
          <div className="edit-profile-bottom">

            <div className="edit-profile-bottom-text">
              <strong>
                Keep your profile updated
              </strong>

              <span>
                A complete profile can help you stand out to employers.
              </span>
            </div>

            <button
              type="submit"
              className="edit-profile-update-btn"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="edit-profile-btn-loader"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave />
                  Save & Update Profile
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Editprofile;