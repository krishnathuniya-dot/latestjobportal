import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/seekerlogin.css";

const Seekerlogin = () => {
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
        "https://latestjobportal-11.onrender.com/api/loginn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      console.log("Login Response:", result);

      if (response.ok) {
        setMessage(result.message);

        // Full user object save
        localStorage.setItem(
          "user",
          JSON.stringify(result.user)
        );

        // Candidate ID save
        localStorage.setItem(
          "candidateId",
          result.user._id
        );

        // Candidate Name save
        localStorage.setItem(
          "candidateName",
          result.user.fullName
        );

        console.log(
          "Candidate ID Saved:",
          result.user._id
        );

        console.log(
          "Candidate Name Saved:",
          result.user.fullName
        );

        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.log(error);
      setMessage("Server Error");
    }
  };

  return (
    <>

      <div className="login-header">
        <h1>Login To Your Account</h1>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="profile-icon">👤</div>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">
              SIGN IN
            </button>
          </form>

          <p className="forgot">
            <Link to="/forgot-password" className="forgot-link">
    Forgot your Password?
  </Link>
          </p>

          <div className="or">
            OR
          </div>

          <p className="signup">
            You Don't have an Account?
            <span> <Link to={"/seeker"}>SIGN UP NOW</Link></span>
          </p>

          <p
            className="home"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            🏠 Back Home!!!
          </p>
        </div>
      </div>
    </>
  );
};

export default Seekerlogin;