import React, { useEffect, useState } from "react";
import "../css/ContactPage.css";

export default function ContactPage() {
  const [contact, setContact] = useState({
    mobileNumber: "",
    email: "",
    pageDescription: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("contactData");
    if (storedData) {
      setContact(JSON.parse(storedData));
    }
  }, []);

  return (
    <div className="ouu-contact-page">
      <header className="ouu-contact-page__banner">
        <h1>Contact Us</h1>
      </header>

      <main className="ouu-contact-page__content">
        <h2 className="ouu-contact-page__title">Get in Touch</h2>

        <div className="ouu-contact-card">
          <div className="ouu-contact-card__item">
            <span className="ouu-contact-card__icon">📞</span>
            <span className="ouu-contact-card__text">{contact.mobileNumber || "Not available"}</span>
          </div>

          <div className="ouu-contact-card__item">
            <span className="ouu-contact-card__icon">✉️</span>
            <span className="ouu-contact-card__text">{contact.email || "Not available"}</span>
          </div>

          <div className="ouu-contact-card__item">
            <span className="ouu-contact-card__icon">📍</span>
            <span className="ouu-contact-card__text">{contact.pageDescription || "Address not set"}</span>
          </div>
        </div>
      </main>
    </div>
  );
}