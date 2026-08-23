const Admin = require("../model/Admin");
const bcrypt = require("bcrypt");

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
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: "admin@gmail.com" }).select("-password");

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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { name, username, email, contact } = req.body;

    const updateData = {
      name,
      username,
      email,
      contact,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const admin = await Admin.findOneAndUpdate(
      { email: "admin@gmail.com" },
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      admin,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  adminLogin,
   getAdmin,
  updateAdmin
};