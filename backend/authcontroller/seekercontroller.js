const JobSeeker = require("../model/seeker");
const bcrypt = require("bcrypt");

const registerJobSeeker = async (req, res) => {
  try {
    const { fullName, email, contactNumber, password } = req.body;

    // Validation
    if (!fullName || !email || !contactNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await JobSeeker.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await JobSeeker.create({
      fullName,
      email,
      contactNumber,
      password: hashedPassword,
      resume: req.file?.filename || "",
    });

    return res.status(201).json({
      success: true,
      message: "Signup Successful",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        contactNumber: newUser.contactNumber, 
        resume: newUser.resume,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const loginJobSeeker = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Find user
    const user = await JobSeeker.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Remove password from response
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: userData,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await JobSeeker.findById(id).select("-password");

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateProfile = async (req, res) => {
  try {
    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      summary: req.body.summary,
      skills: req.body.skills,
    };

    if (req.file) {
      updateData.profilePic = req.file.filename;
    }

    const user = await JobSeeker.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const addEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      qualification,
      college,
      year,
      percentage,
      stream,
      cgpa,
    } = req.body;

    const user = await JobSeeker.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    user.education.push({
      qualification,
      college,
      year,
      percentage,
      stream,
      cgpa,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Education Added Successfully",
      education: user.education,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      employerName,
      employmentType,
      designation,
      fromDate,
      toDate,
      ctc,
    } = req.body;

    const user = await JobSeeker.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    user.experience.push({
      employerName,
      employmentType,
      designation,
      fromDate,
      toDate,
      ctc,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Experience Added Successfully",
      experience: user.experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getJobseekers = async (req, res) => {
  try {
    const jobseekers = await JobSeeker.find()
      .sort({ createdAt: -1 });

    res.status(200).json(jobseekers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getCandidatesBetweenDates = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);

    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const candidates = await JobSeeker.find({
      createdAt: {
        $gte: from,
        $lte: to,
      },
    }).select("-password");

    return res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};






module.exports = {
  registerJobSeeker,
  loginJobSeeker,
  getProfile,
  updateProfile,addEducation,
  addExperience,getJobseekers,getCandidatesBetweenDates
};

