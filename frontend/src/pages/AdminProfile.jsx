import { useEffect, useState } from "react";
import { User, Mail, Phone, AtSign, Camera, Save } from 'lucide-react'; // Icons import kiye
import "../css/AdminProfile.css";

function AdminProfile() {
    const [admin, setAdmin] = useState({
        name: "",
        username: "",
        email: "",
        contact: "",
        image: ""
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false); // Loading state add kiya

    useEffect(() => {
        fetchAdmin();
    }, []);

    const fetchAdmin = async () => {
        try {
            const res = await fetch("http://localhost:2340/api/admin");
            const data = await res.json();
            if (data.success) {
                setAdmin(data.admin);
                if (data.admin.image) {
                    setPreview(`http://localhost:2340/uploads/admin/${data.admin.image}`);
                }
            }
        } catch (error) {
            console.error("Error fetching admin:", error);
        }
    };

    const handleChange = (e) => {
        setAdmin({
            ...admin,
            [e.target.name]: e.target.value
        });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("name", admin.name);
        formData.append("username", admin.username);
        formData.append("email", admin.email);
        formData.append("contact", admin.contact);
        if (image) formData.append("image", image);

        try {
            const res = await fetch("http://localhost:2340/api/admin", {
                method: "PUT",
                body: formData
            });
            const data = await res.json();
            alert(data.message);
            fetchAdmin();
        } catch (error) {
            alert("Update failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ap__container">
            <div className="ap__card">
                {/* Header Section added */}
                <div className="ap__header">
                    <h2>My Profile</h2>
                    <p>Update your personal information</p>
                </div>

                <div className="ap__main">
                    {/* Image Section */}
                    <div className="ap__image-section">
                        <div className="ap__avatar-wrapper">
                            <img
                                src={preview ? preview : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                alt="Admin Avatar"
                                className="ap__avatar"
                            />
                            <label className="ap__overlay-camera">
                                <Camera size={20} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                    hidden
                                />
                            </label>
                        </div>
                        <h3 className="ap__admin-name">{admin.name || "Admin"}</h3>
                        <span className="ap__badge">Administrator</span>
                    </div>

                    {/* Form Section with Icons */}
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

                        <button type="submit" className="ap__submit-btn" disabled={loading}>
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