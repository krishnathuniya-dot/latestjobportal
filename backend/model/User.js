const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    personName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      default: "",
    },

    tagline: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    noOfEmployees: {
      type: Number,
      default: 0,
    },

    industry: {
      type: String,
      default: "",
    },

    businessType: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    established: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    // Forgot Password Fields
    resetOtp: {
      type: String,
      default: null,
    },

    otpExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);