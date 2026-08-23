const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({

  name: {
    type: String,
    default: "",
  },

  username: {
    type: String,
    default: "admin",
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  contact: {
    type: String,
    default: "",
  },
    image: {
    type: String,
    default: "",
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "admin",
  },

}, {
  timestamps: true
});

module.exports = mongoose.model("Admin", adminSchema);