// 📂 Login.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";

export default function Login() {

  const navigate = useNavigate();

  const [formDataRrr, setFormDataRrr] = useState({
    email: "",
    password: "",
  });

  
  const handleChangeRrr = (e) => {

    setFormDataRrr({
      ...formDataRrr,
      [e.target.name]: e.target.value,
    });

  };

 
  const handleSubmitRrr = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "https://latestjobportal-11.onrender.com/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formDataRrr),
        }
      );

      const data = await response.json();

      
      if (data.success) {

        
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

      
        console.log(
          "Current User => ",
          JSON.parse(localStorage.getItem("user"))
        );
        console.log(data)

        alert(data.message);

        // Redirect
        navigate("/search");

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);

      alert("Login Failed");

    }
  };

  return (

    <div className="login-body-rrr">

      {/* Banner */}
      <div className="login-top-banner-rrr">

        <h1>
          Login To Your Account
        </h1>

      </div>

      {/* Login Box */}
      <div className="login-container-rrr">

        {/* Back Button */}
        <div className="login-back-btn-rrr">

          <Link
            to="/"
            className="login-back-link-rrr"
          >
            ← Back To Home
          </Link>

        </div>

        {/* Profile Image */}
        <div className="login-profile-icon-rrr">

          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="profile"
          />

        </div>

        {/* Form */}
        <form
          className="login-form-rrr"
          onSubmit={handleSubmitRrr}
        >

          {/* Email */}
          <input
            className="login-input-rrr"
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formDataRrr.email}
            onChange={handleChangeRrr}
            required
          />

          {/* Password */}
          <input
            className="login-input-rrr"
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formDataRrr.password}
            onChange={handleChangeRrr}
            required
          />

          {/* Button */}
          <button
            className="login-button-rrr"
            type="submit"
          >
            SIGN IN
          </button>

        </form>

        {/* Forgot */}
        <p className="login-forgot-rrr">
          <Link
    to="/forgotpassword"
    className="login-forgot-link-rrr"
  >
    Forgot your Password?
  </Link>
        </p>

        {/* OR */}
        <div className="login-or-box-rrr">
          OR
        </div>

        {/* Signup */}
        <p className="login-signup-rrr">

          You Don't have an Account ?

          <Link
            to="/register"
            className="login-signup-link-rrr"
          >
            SIGN UP NOW
          </Link>

        </p>

      </div>

    </div>

  );
}