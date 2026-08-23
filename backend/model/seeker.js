const mongoose = require("mongoose");

const seekerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  profilePic: {
    type: String,
    default: "",
  },
    skills: {
    type: String,
    default: "",
  },
    resume: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

   education: [
  {
    qualification: String,
    college: String,
    year: String,
    percentage: String,
    stream: String,
    cgpa: String,
  }
],

    experience: [
  {
    employerName: String,
    employmentType: String,
    designation: String,
    fromDate: String,
    toDate: String,
    ctc: String,
  },
],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobSeeker", seekerSchema);