
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../model/User");

// REGISTER
const register = async (req, res) => {
  try {
    const {
      personName,
      email,
      password,
      companyName,
      tagline,
      description,
      website,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cloudinary image URL
    const logo = req.file ? req.file.path : "";

    const newUser = new User({
      personName,
      email,
      password: hashedPassword,
      companyName,
      tagline,
      description,
      website,
      logo,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Register Successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("Register Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong Password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user,
    });
  } catch (error) {
    console.log("Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET USER
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Get User Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// UPDATE USER PROFILE
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      personName: req.body.personName,
      email: req.body.email,
      companyName: req.body.companyName,
      tagline: req.body.tagline,
      description: req.body.description,
      website: req.body.website,
      noOfEmployees: req.body.noOfEmployees,
      industry: req.body.industry,
      businessType: req.body.businessType,
      location: req.body.location,
      established: req.body.established,
    };

    // Remove undefined fields so existing values are not overwritten
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Save Cloudinary URL when a new logo is uploaded
    if (req.file) {
      updateData.logo = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Update User Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body || {};

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Change Password Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET ALL EMPLOYERS
const getEmployers = async (req, res) => {
  try {
    const employers = await User.find()
      .select("-password -resetOtp")
      .sort({ createdAt: -1 });

    res.status(200).json(employers);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET EMPLOYER BY ID
const getEmployerById = async (req, res) => {
  try {
    const employer = await User.findById(req.params.id)
      .select("-password -resetOtp");

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    res.status(200).json(employer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// SEND PASSWORD RESET OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetOtp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("Send OTP Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (String(user.resetOtp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otpExpire || user.otpExpire.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      String(user.resetOtp) !== String(otp) ||
      !user.otpExpire ||
      user.otpExpire.getTime() < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    user.otpExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUser,
  updateUser,
  changePassword,
  getEmployers,
  getEmployerById,
  sendOtp,
  verifyOtp,
  resetPassword,
};
