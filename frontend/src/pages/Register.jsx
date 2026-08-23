import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🎯 फिक्स: useNavigate इम्पोर्ट किया
import "../css/register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    personName: "",
    email: "",
    password: "",
    companyName: "",
    tagline: "",
    description: "",
    website: "",
    logo: null,
  });

  const navigate = useNavigate(); // 🎯 फिक्स: नेविगेट फंक्शन इनिशियलाइज किया

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("personName", formData.personName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("companyName", formData.companyName);
      data.append("tagline", formData.tagline);
      data.append("description", formData.description);
      data.append("website", formData.website);

      if (formData.logo) {
        data.append("logo", formData.logo);
      }

      const response = await fetch(
        "https://latestjobportal-11.onrender.com/api/register",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      console.log("Register Response:", result);

      if (response.ok) {
        // Full user save in localStorage
        localStorage.setItem(
          "User",
          JSON.stringify(result.user)
        );

        console.log(
          "Saved User:",
          JSON.parse(localStorage.getItem("User"))
        );

        alert(
          result.message || "Register Successfully"
        );

        setFormData({
          personName: "",
          email: "",
          password: "",
          companyName: "",
          tagline: "",
          description: "",
          website: "",
          logo: null,
        });

        const fileInput = document.querySelector(
          'input[type="file"]'
        );

        if (fileInput) {
          fileInput.value = "";
        }

        // 🎯 फिक्स: अलर्ट बंद होने के बाद यूजर /login पेज पर चला जाएगा
        navigate("/login"); 

      } else {
        alert(
          result.message ||
            "Registration Failed"
        );
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to server");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-grid">

          {/* Concern Person */}
          <div className="form-group">
            <label>Concern Person Name *</label>
            <input
              type="text"
              name="personName"
              placeholder="name"
              value={formData.personName}
              onChange={handleChange}
              required // बेसिक वैलिडेशन के लिए आप required भी रख सकते हैं
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Your Email *</label>
            <input
              type="email"
              name="email"
              placeholder="enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Company */}
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="compony name"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          {/* Tagline */}
          <div className="form-group">
            <label>Tagline</label>
            <input
              type="text"
              name="tagline"
              placeholder=""
              value={formData.tagline}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="5"
            placeholder="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-grid">
          {/* Website */}
          <div className="form-group">
            <label>Website</label>
            <input
              type="text"
              name="website"
              placeholder="http://www."
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          {/* Logo */}
          <div className="form-group">
            <label>Logo</label>
            <input
              type="file"
              name="logo"
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="signup-btn">
          SIGN UP
        </button>
      </form>
    </div>
  );
}