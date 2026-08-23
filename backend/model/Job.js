const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
    
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  jobTitle: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    default: "Full Time"
  },
  salaryPackage: {
    type: String
  },
  skillRequired: {
    type: String
  },
  experience: {
    type: String
  },
  jobLocation: {
    type: String
  },
  jobExpirationDate: {
    type: Date
  },
  jobDescription: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', JobSchema);