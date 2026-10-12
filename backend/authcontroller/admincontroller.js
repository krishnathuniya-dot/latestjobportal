
const Admin = require("../model/Admin");
const bcrypt = require("bcrypt");

// ADMIN LOGIN
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login Successful",
      admin,
    });
  } catch (error) {
    console.log("Admin Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET ADMIN PROFILE
const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      email: "admin@gmail.com",
    }).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.log("Get Admin Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE ADMIN PROFILE
const updateAdmin = async (req, res) => {
  try {
    const { name, username, email, contact } = req.body;

    const updateData = {};

    // Update only fields sent by frontend
    if (name !== undefined) updateData.name = name;
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (contact !== undefined) updateData.contact = contact;

    // Save Cloudinary image URL
    if (req.file) {
      updateData.image = req.file.path;
    }

    const admin = await Admin.findOneAndUpdate(
      { email: "admin@gmail.com" },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      admin,
    });
  } catch (error) {
    console.log("Update Admin Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  adminLogin,
  getAdmin,
  updateAdmin,
};
