import React, { useState } from "react";
import "../css/Admin.css";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://latestjobportal-11.onrender.com/api/admin-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin)
        );

        alert(data.message);

        navigate("/dash");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.log(error);
      setMessage("Server Error");
    }
  };

  return (
    <div className="container admin">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="title">Admin Login</h1>

        {message && (
          <p className="error-message">
            {message}
          </p>
        )}

        <input
          type="email"
          name="email"
          className="input-field"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          className="input-field"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="login-btn"
        >
          Login
        </button>
      </form>
    </div>
  );
}