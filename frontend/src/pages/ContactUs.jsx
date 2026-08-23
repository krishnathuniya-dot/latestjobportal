import React, { useEffect, useState } from "react";
import "../css/Contactus.css";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    pageTitle: "",
    email: "",
    mobileNumber: "",
    pageDescription: "",
  });

  useEffect(() => {
    const localData = localStorage.getItem(
      "contactData"
    );

    if (localData) {
      setFormData(JSON.parse(localData));
    }

    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await fetch(
        "http://localhost:2340/api/contact"
      );

      const data = await res.json();

      if (data.success) {
        setFormData(data.data);

        localStorage.setItem(
          "contactData",
          JSON.stringify(data.data)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const updatedData = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    setFormData(updatedData);

    localStorage.setItem(
      "contactData",
      JSON.stringify(updatedData)
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://latestjobportal-11.onrender.com/api/contact",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(
          "contactData",
          JSON.stringify(formData)
        );

        alert("Updated Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
   <div className="yy-contact-container">
      <div className="yy-contact-card">
        <div className="yy-contact-header">Update Contact Us</div>
        <div className="yy-contact-body">
          <form onSubmit={handleUpdate}>
            <div className="yy-form-group">
              <label>Page Title:</label>
              <input type="text" name="pageTitle" className="yy-form-control" value={formData.pageTitle} onChange={handleChange} />
            </div>
            <div className="yy-form-group">
              <label>Email:</label>
              <input type="email" name="email" className="yy-form-control" value={formData.email} onChange={handleChange} />
            </div>
            <div className="yy-form-group">
              <label>Mobile Number:</label>
              <input type="text" name="mobileNumber" className="yy-form-control" value={formData.mobileNumber} onChange={handleChange} />
            </div>
            <div className="yy-form-group">
              <label>Page Description:</label>
              <textarea name="pageDescription" className="yy-form-textarea" value={formData.pageDescription} onChange={handleChange} />
            </div>
            <button type="submit" className="yy-update-btn">+ Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}