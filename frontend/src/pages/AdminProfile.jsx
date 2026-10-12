
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  AtSign,
  Camera,
  Save,
} from "lucide-react";

import "../css/AdminProfile.css";

const API_URL = "https://latestjobportal.onrender.com";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

function AdminProfile() {
  const [admin, setAdmin] = useState({
    name: "",
    username: "",
    email: "",
    contact: "",
    image: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH ADMIN PROFILE
  const fetchAdmin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch admin");
      }

      const adminData = data.admin;

      setAdmin({
        name: adminData.name || "",
        username: adminData.username || "",
        email: adminData.email || "",
        contact: adminData.contact || "",
        image: adminData.image || "",
      });

      // Cloudinary URL directly use karo
      setPreview(adminData.image || "");
      setImage(null);
    } catch (error) {
      console.error("Error fetching admin:", error);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setAdmin((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // IMAGE SELECT AND PREVIEW
  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setImage(file);

    // Local preview until upload completes
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  // UPDATE ADMIN PROFILE
  const updateProfile = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", admin.name);
      formData.append("username", admin.username);
      formData.append("email", admin.email);
      formData.append("contact", admin.contact);

      // Backend route must use upload.single("image")
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${API_URL}/api/admin`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Profile update failed");
      }

      if (data.admin) {
        setAdmin({
          name: data.admin.name || "",
          username: data.admin.username || "",
          email: data.admin.email || "",
          contact: data.admin.contact || "",
          image: data.admin.image || "",
        });

        // Updated Cloudinary URL
        setPreview(data.admin.image || "");
      }

      setImage(null);

      alert(data.message || "Profile updated successfully!");

      // Fetch latest saved profile
      await fetchAdmin();
    } catch (error) {
      console.error("Update admin error:", error);
      alert(error.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ap__container">
      <div className="ap__card">
        <div className="ap__header">
          <h2>My Profile</h2>
          <p>Update your personal information</p>
        </div>

        <div className="ap__main">
          {/* IMAGE SECTION */}
          <div className="ap__image-section">
            <div className="ap__avatar-wrapper">
              <img
                src={preview || DEFAULT_AVATAR}
                alt="Admin Avatar"
                className="ap__avatar"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />

              <label className="ap__overlay-camera">
                <Camera size={20} />

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImage}
                  hidden
                />
              </label>
            </div>

            <h3 className="ap__admin-name">
              {admin.name || "Admin"}
            </h3>

            <span className="ap__badge">
              Administrator
            </span>
          </div>

          {/* FORM SECTION */}
          <form onSubmit={updateProfile} className="ap__form">
            <div className="ap__input-group">
              <User className="ap__icon" size={20} />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={admin.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ap__input-group">
              <AtSign className="ap__icon" size={20} />

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={admin.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ap__input-group">
              <Mail className="ap__icon" size={20} />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={admin.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ap__input-group">
              <Phone className="ap__icon" size={20} />

              <input
                type="text"
                name="contact"
                placeholder="Contact Number"
                value={admin.contact}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="ap__submit-btn"
              disabled={loading}
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
