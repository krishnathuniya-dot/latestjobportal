import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, Search, Layers } from "lucide-react";
import "../css/MangeCategory.css";

const Managecategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await fetch("https://latestjobportal-11.onrender.com/api/categories");
      const result = await response.json();
      if (Array.isArray(result)) setCategories(result);
      else if (Array.isArray(result.data)) setCategories(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mc__container">
      <div className="mc__card">
        {/* Header Section */}
        <div className="mc__header">
          <div className="mc__title-group">
            <Layers className="mc__icon" />
            <div>
              <h2>Manage Categories</h2>
              <p>Total {categories.length} categories found</p>
            </div>
          </div>
          <button className="mc__add-btn">
            <Plus size={20} /> Add New
          </button>
        </div>

        {/* Table Section */}
        <div className="mc__table-wrapper">
          <table className="mc__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td className="mc__name">{item.category}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="mc__action-btns">
                        <button className="mc__btn mc__btn--edit"><Edit2 size={16} /></button>
                        <button className="mc__btn mc__btn--delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="mc__no-data">No Categories Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Managecategory;