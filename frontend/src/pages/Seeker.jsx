import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // 🎯 फिक्स 1: useNavigate इम्पोर्ट किया
import "../css/seeker.css";

const Seeker = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // 🎯 फिक्स 2: नेविगेट फंक्शन इनिशियलाइज किया

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected File:", file);
    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("contactNumber", formData.contactNumber);
      data.append("password", formData.password);

      if (resume) {
        data.append("resume", resume);
      }

      const response = await fetch("https://latestjobportal-11.onrender.com/api/registerr", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      console.log("Registration Response:", result);

      if (response.ok) {
        localStorage.setItem("candidateId", result.user._id);
        localStorage.setItem("candidateName", result.user.fullName);
        console.log("Saved Candidate ID:", result.user._id);

        setMessage({ text: result.message || "Account Created Successfully!", type: "success" });
        
        // फॉर्म डेटा क्लियर करना
        setFormData({
          fullName: "",
          email: "",
          contactNumber: "",
          password: "",
        });
        setResume(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // 🎯 फिक्स 3: सक्सेस होने पर थोड़ा सा रुक कर (1.5 सेकंड) ताकि यूजर मैसेज देख सके, Seeker Login पेज पर भेज देगा
        setTimeout(() => {
          navigate("/seekerlogin");
        }, 1500);

      } else {
        setMessage({ text: result.message || "Registration Failed", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Something went wrong. Please try again.", type: "error" });
    }
  };

  return (
    <div className="sk-container">
      <div className="sk-card">
        {/* Header section */}
        <div className="sk-header">
          <h1 className="sk-title">Job Seeker Registration</h1>
          <p className="sk-subtitle">Apna account banayein aur top jobs ke liye apply karna shuru karein.</p>
        </div>

        {/* Dynamic Alert Messages */}
        {message && (
          <div className={`sk-alert ${message.type === "success" ? "sk-alert-success" : "sk-alert-error"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="sk-form">
          {/* Row 1: Full Name & Email */}
          <div className="sk-row">
            <div className="sk-group">
              <label className="sk-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="sk-input"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="sk-group">
              <label className="sk-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="sk-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                required
              />
            </div>
          </div>

          {/* Row 2: Contact & Password */}
          <div className="sk-row">
            <div className="sk-group">
              <label className="sk-label">Contact Number *</label>
              <input
                type="text"
                name="contactNumber"
                className="sk-input"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div className="sk-group">
              <label className="sk-label">Password *</label>
              <input
                type="password"
                name="password"
                className="sk-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Row 3: Modern Resume Upload Box */}
          <div className="sk-group">
            <label className="sk-label">Upload Resume *</label>
            <div className={`sk-file-wrapper ${resume ? "has-file" : ""}`}>
              <input
                ref={fileInputRef}
                type="file"
                name="resume"
                className="sk-file-hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
              <div className="sk-file-dummy">
                <span className="sk-file-icon">📁</span>
                <p className="sk-file-text">
                  {resume ? `Selected: ${resume.name}` : "Click to browse or upload your resume"}
                </p>
                <p className="sk-file-hint">Supports PDF, DOC, DOCX up to 5MB</p>
              </div>
            </div>
          </div>

          <button type="submit" className="sk-submit-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Seeker;