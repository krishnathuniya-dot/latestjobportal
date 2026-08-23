import React, { useState } from "react";
import "../css/AddCategory.css";

export default function AddCategory() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://latestjobportal-11.onrender.com/api/add-category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category,
            description,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        setCategory("");
        setDescription("");
      } else {
        alert(data.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server Error");
    }
  };

  return (
    <div className="uk-add-category-container">
      <h2 className="uk-page-title">Add Category</h2>

      <div className="uk-category-card">
        <div className="uk-category-card-header">
          Add Category
        </div>

        <form
          className="uk-category-form"
          onSubmit={handleSubmit}
        >
          <div className="uk-form-group">
            <label className="uk-form-label">
              Category:
            </label>

            <input
              type="text"
              className="uk-form-input"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              required
            />
          </div>

          <div className="uk-form-group">
            <label className="uk-form-label">
              Category Description:
            </label>

            <textarea
              className="uk-form-textarea"
              rows="5"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="uk-add-btn"
          >
            + Add
          </button>
        </form>
      </div>
    </div>
  );
}