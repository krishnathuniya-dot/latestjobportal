const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    pageTitle: {
      type: String,
      default: "Contact Us",
    },
    email: String,
    mobileNumber: String,
    pageDescription: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);