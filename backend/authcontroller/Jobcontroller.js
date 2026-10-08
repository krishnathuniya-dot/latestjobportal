const mongoose = require("mongoose");

const Job = require("../model/Job");
const Application = require("../model/Apply");

/* =========================================================
   POST JOB
========================================================= */

const postjob = async (req, res) => {
  try {
    const {
      employerId,
      category,
      jobTitle,
      jobType,
      salaryPackage,
      skillRequired,
      experience,
      jobLocation,
      jobExpirationDate,
      jobDescription,
    } = req.body;

    if (!employerId) {
      return res.status(400).json({
        success: false,
        message: "Employer ID is required",
      });
    }

    const newJob = new Job({
      employerId,
      category,
      jobTitle,
      jobType,
      salaryPackage,
      skillRequired,
      experience,
      jobLocation,
      jobExpirationDate,
      jobDescription,
    });

    const savedJob = await newJob.save();

    return res.status(201).json({
      success: true,
      message: "Job Posted Successfully",
      job: savedJob,
    });
  } catch (error) {
    console.log("Post Job Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   MANAGE ALL JOBS
========================================================= */

const managejob = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate(
        "employerId",
        "personName companyName email logo website tagline description"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.log("Manage Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


/* =========================================================
   GET SINGLE JOB
========================================================= */

const managejobb = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID",
      });
    }

    const job = await Job.findById(id).populate(
      "employerId",
      "personName companyName email logo website tagline description"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found!",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log("Single Job Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   APPLY JOB
========================================================= */

const applyJob = async (req, res) => {
  try {
    console.log("================================");
    console.log("          APPLY JOB");
    console.log("================================");
    console.log("Request Body:", req.body);

    const { jobId, candidateId } = req.body;

    /* -----------------------------------------
       Check Job ID
    ----------------------------------------- */

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    /* -----------------------------------------
       Check Candidate ID
    ----------------------------------------- */

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required",
      });
    }

    /* -----------------------------------------
       Validate Job ID
    ----------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID",
      });
    }

    /* -----------------------------------------
       Validate Candidate ID
    ----------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Candidate ID",
      });
    }

    /* -----------------------------------------
       Check Job Exists
    ----------------------------------------- */

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    /* -----------------------------------------
       Check Already Applied
    ----------------------------------------- */

    const alreadyApplied = await Application.findOne({
      jobId,
      candidateId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    /* -----------------------------------------
       Create Application
    ----------------------------------------- */

    const application = await Application.create({
      jobId,
      candidateId,
      status: "Not Responded Yet",
      message: "",
    });

    console.log("================================");
    console.log("APPLICATION CREATED");
    console.log("Application ID:", application._id);
    console.log("Job ID:", application.jobId);
    console.log("Candidate ID:", application.candidateId);
    console.log("================================");

    return res.status(201).json({
      success: true,
      message: "Applied Successfully",
      application,
    });

  } catch (error) {
    console.log("Apply Job Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET APPLICANTS FOR JOB
========================================================= */

const getApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID",
      });
    }

    const applicants = await Application.find({
      jobId,
      candidateId: { $ne: null },
    })
      .populate({
        path: "candidateId",
      })
      .populate({
        path: "jobId",
        populate: {
          path: "employerId",
          select:
            "personName companyName email logo website tagline description",
        },
      })
      .sort({ createdAt: -1 });

    console.log("================================");
    console.log("GET APPLICANTS");
    console.log("Job ID:", jobId);
    console.log("Total Applicants:", applicants.length);
    console.log("================================");

    return res.status(200).json({
      success: true,
      count: applicants.length,
      data: applicants,
    });

  } catch (error) {
    console.log("Get Applicants Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   MY APPLICATIONS
========================================================= */

const myApplications = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Candidate ID",
      });
    }

    const applications = await Application.find({
      candidateId,
    })
      .populate({
        path: "jobId",
        populate: {
          path: "employerId",
          select:
            "personName companyName email logo website tagline description",
        },
      })
      .populate("candidateId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });

  } catch (error) {
    console.log("My Applications Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   APPLICATION DETAILS
========================================================= */

const getApplicationDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Application ID",
      });
    }

    const application = await Application.findById(id)
      .populate({
        path: "jobId",
        populate: {
          path: "employerId",
          select:
            "personName companyName email logo website tagline description",
        },
      })
      .populate("candidateId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });

  } catch (error) {
    console.log("Application Details Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   UPDATE APPLICATION STATUS
========================================================= */

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Application ID",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const application =
      await Application.findByIdAndUpdate(
        id,
        {
          status,
          message: message || "",
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("jobId")
        .populate("candidateId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application Updated Successfully",
      data: application,
    });

  } catch (error) {
    console.log(
      "Update Application Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET EMPLOYER JOBS
========================================================= */

const getEmployerJobs = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Employer ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employer ID",
      });
    }

    const jobs = await Job.find({
      employerId: userId,
    })
      .populate("employerId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: jobs,
    });

  } catch (error) {
    console.log("Employer Jobs Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET JOBS BY CATEGORY
========================================================= */

const getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const jobs = await Job.find({
      category,
    })
      .populate(
        "employerId",
        "personName companyName email logo website tagline description"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });

  } catch (error) {
    console.log(
      "Category Jobs Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET JOBS BY EMPLOYER ID
========================================================= */

const getidjobs = async (req, res) => {
  try {
    const employerId = req.params.id;

    if (!employerId) {
      return res.status(400).json({
        success: false,
        message: "Employer ID is required!",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(employerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employer ID",
      });
    }

    const jobs = await Job.find({
      employerId,
    })
      .populate(
        "employerId",
        "personName companyName email logo website tagline description"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: jobs,
    });

  } catch (error) {
    console.log(
      "Get Employer Jobs Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  postjob,
  managejob,
  managejobb,
  applyJob,
  getApplicants,
  myApplications,
  getApplicationDetails,
  updateApplicationStatus,
  getEmployerJobs,
  getJobsByCategory,
  getidjobs,
};