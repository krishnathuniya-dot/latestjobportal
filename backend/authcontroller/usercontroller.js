const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../model/User");



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

    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

   
    let logo = "";

    if (req.file) {
      logo = req.file.filename;
    }

    
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email not found",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong Password",
      });
    }

    // Login Success
    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



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

    // New logo uploaded
    if (req.file) {
      updateData.logo = req.file.filename;
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
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {

    const { id } = req.params;

    // IMPORTANT
    const {
      oldPassword,
      newPassword,
    } = req.body || {};

    // Check Empty Fields
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find User
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Match Old Password
    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Hash New Password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Save New Password
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getEmployers = async (req, res) => {
  try {
    const employers = await User.find().sort({
      createdAt: -1,
    });

    res.status(200).json(employers);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getEmployerById = async (req, res) => {
  try {
    const employer = await User.findById(req.params.id);

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
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    console.log("Stored OTP:", user?.resetOtp);
    console.log("Entered OTP:", otp);

    console.log("Expiry:", user?.otpExpire);
    console.log("Now:", new Date());

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

    if (user.otpExpire.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetOtp != otp ||
      user.otpExpire < Date.now()
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