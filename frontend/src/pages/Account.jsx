import React, { useEffect, useState } from "react";
import "../css/aaccount.css";

export default function Account() {
  const [formData, setFormData] = useState({
    personName: "",
    email: "",
    companyName: "",
    tagline: "", // Added
    description: "", // Added
    website: "",
    noOfEmployees: "", // Added
    industry: "",
    businessType: "",
    location: "",
    established: "",
    logo: "",
  });

  // Image file object ko tracking ke liye alag state
  const [logoFile, setLogoFile] = useState(null);

  // ================= FETCH USER =================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("User"));
        if (!user) return;

        const res = await fetch(`http://localhost:2340/api/user/${user._id}`);
        const data = await res.json();

        if (data && data.user) {
          setFormData({
            personName: data.user.personName || "",
            email: data.user.email || "",
            companyName: data.user.companyName || "",
            tagline: data.user.tagline || "",
            description: data.user.description || "",
            website: data.user.website || "",
            noOfEmployees: data.user.noOfEmployees || "",
            industry: data.user.industry || "",
            businessType: data.user.businessType || "",
            location: data.user.location || "",
            established: data.user.established || "",
            logo: data.user.logo || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LOGO CHANGE =================

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file); // Actual file object backend ke liye save kiya
      setFormData({
        ...formData,
        logo: URL.createObjectURL(file), // UI display ke liye preview banaya
      });
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const user = JSON.parse(localStorage.getItem("User"));

    if (!user || !user._id) {
      alert("User not found");
      return;
    }

    const dataToSend = new FormData();

    dataToSend.append("personName", formData.personName);
    dataToSend.append("email", formData.email);
    dataToSend.append("companyName", formData.companyName);
    dataToSend.append("tagline", formData.tagline);
    dataToSend.append("description", formData.description);
    dataToSend.append("website", formData.website);
    dataToSend.append("noOfEmployees", formData.noOfEmployees);
    dataToSend.append("industry", formData.industry);
    dataToSend.append("businessType", formData.businessType);
    dataToSend.append("location", formData.location);
    dataToSend.append("established", formData.established);

    if (logoFile) {
      dataToSend.append("logo", logoFile);
    }

    const response = await fetch(
      `http://localhost:2340/api/update/${user._id}`,
      {
        method: "PUT",
        body: dataToSend,
      }
    );

    const result = await response.json();

    console.log("UPDATE RESPONSE =>", result);

    if (!response.ok || !result.success) {
      alert(result.message || "Update Failed");
      return;
    }

    const updatedUser = result.user;

    setFormData({
      personName: updatedUser.personName || "",
      email: updatedUser.email || "",
      companyName: updatedUser.companyName || "",
      tagline: updatedUser.tagline || "",
      description: updatedUser.description || "",
      website: updatedUser.website || "",
      noOfEmployees: updatedUser.noOfEmployees || "",
      industry: updatedUser.industry || "",
      businessType: updatedUser.businessType || "",
      location: updatedUser.location || "",
      established: updatedUser.established || "",
      logo: updatedUser.logo || "",
    });

    localStorage.setItem(
      "User",
      JSON.stringify(updatedUser)
    );

    setLogoFile(null);

    alert("Profile Updated Successfully");
  } catch (error) {
    console.error("Update Error =>", error);
    alert(error.message);
  }
};
  

 return (
    <div className="jk_account_container">
      <form className="jk_account_form" onSubmit={handleSubmit}>
        <div className="jk_grid">
          
          {/* Row 1 */}
          <div className="jk_input_box">
            <label>Person Name *</label>
            <input
              type="text"
              name="personName"
              placeholder="Enter Name"
              value={formData.personName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="jk_input_box">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Row 2 */}
          <div className="jk_input_box">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter Company Name"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          <div className="jk_input_box">
            <label>Tagline</label>
            <input
              type="text"
              name="tagline"
              placeholder="Enter Tagline"
              value={formData.tagline}
              onChange={handleChange}
            />
          </div>

          {/* Description Textarea Full Width Row */}
          <div className="jk_input_box jk_full_width">
            <label>Description</label>
            <div className="jk_editor_mock">
              <div className="jk_editor_toolbar">
                <span className="jk_tool_btn"><b>B</b></span>
                <span className="jk_tool_btn"><i>I</i></span>
                <span className="jk_tool_btn"><u>U</u></span>
                <span className="jk_tool_select">Font Size</span>
                <span className="jk_tool_select">Font Family</span>
                <span className="jk_tool_select">Font Format</span>
              </div>
              <textarea
                name="description"
                placeholder="Tata Consultancy Services"
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="jk_input_box">
            <label>Website</label>
            <input
              type="text"
              name="website"
              placeholder="http://company.com"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="jk_input_box">
            <label>No. of Employees</label>
            <input
              type="number"
              name="noOfEmployees"
              placeholder="e.g. 105"
              value={formData.noOfEmployees}
              onChange={handleChange}
            />
          </div>

          {/* Row 4 */}
          <div className="jk_input_box">
            <label>Industry</label>
            <input
              type="text"
              name="industry"
              placeholder="e.g. Insurance"
              value={formData.industry}
              onChange={handleChange}
            />
          </div>

          <div className="jk_input_box">
            <label>Type of Business Entity</label>
            <input
              type="text"
              name="businessType"
              placeholder="e.g. Pvt Ltd"
              value={formData.businessType}
              onChange={handleChange}
            />
          </div>

          {/* Row 5 */}
          <div className="jk_input_box">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. New Delhi"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="jk_input_box">
            <label>Established In</label>
            <input
              type="text"
              name="established"
              placeholder="e.g. 14 Sept 2018"
              value={formData.established}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* LOGO */}
        <div className="jk_logo_section">
          <label className="jk_logo_title">Company Logo</label>
          <div className="jk_logo_box">
   

<img
  src={`http://localhost:2340/uploads/${formData.logo}`}
  alt="logo"
  className="pk_logo_img"
  onError={() => console.log("Image failed to load")}
/>
          </div>

          <label className="jk_change_btn">
            Change Logo
            <input type="file" hidden accept="image/*" onChange={handleLogo} />
          </label>
        </div>

        <button type="submit" className="jk_update_btn">
          Update Profile
        </button>
      </form>
    </div>
  );
}