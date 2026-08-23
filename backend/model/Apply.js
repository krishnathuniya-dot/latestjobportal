const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },
     status: {
      type: String,
      default: "Not Responded Yet",
    },

    message: {
      type: String,
      default: "",
    },
  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);