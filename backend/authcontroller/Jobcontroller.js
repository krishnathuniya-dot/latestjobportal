
const Apply = require("../model/Apply");
const Job = require("../model/Job");
const Application = require("../model/Apply");

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

    // CREATE JOB INSTANCE
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

    // SAVE INSTANCE
    const savedJob = await newJob.save();

    return res.status(201).json({
      success: true,
      message: "Job Posted Successfully",
      job: savedJob,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const managejob = async (req, res) => {
  try {

    const managejob = await Job.find()
      .populate(
        "employerId",
        "personName companyName email logo website tagline description"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: managejob.length,
      data: managejob,
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });

  }
};
const managejobb = async (req, res) => {
  try {
    // 🎯 फिक्स: findById के बाद से सेमीकोलन (;) हटा दिया गया है ताकि .populate चेन हो सके
    const job = await Job.findById(req.params.id).populate(
      "employerId",
      "personName companyName email logo website tagline description"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found!",
      });
    }

    res.json({
      success: true,
      job, // फ्रंटएंड अब सीधे data.job रीड कर पाएगा
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const applyJob = async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;

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

    const application = await Application.create({
      jobId,
      candidateId,
    });

    res.status(201).json({
      success: true,
      message: "Applied Successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// controller/applicationController.js



const getApplicants = async (req, res) => {
  try {

    const applicants =
      await Application.find({
        jobId: req.params.jobId
      })
      .populate("candidateId")
      .populate("jobId");

    res.status(200).json({
      success: true,
      data: applicants
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


const myApplications = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const applications = await Application.find({ candidateId })
      // 🎯 जादू यहाँ है: jobId को लाओ, और उसके अंदर छिपे employerId को भी खींच लाओ!
      .populate({
        path: "jobId",
        populate: {
          path: "employerId", // इसके ज़रिए कंपनी का लोगो और नाम मिल जाएगा
        }
      })
      .populate("candidateId");

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getApplicationDetails = async (req, res) => {
  try {
    const application = await Application.findById(
      req.params.id
    )
      .populate("jobId")
      .populate("candidateId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      {
        status,
        message,
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application Updated Successfully",
      data: application,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getEmployerJobs = async (req, res) => {
  try {

    const jobs = await Job.find({
      employerId: req.params.userId
    });

    res.status(200).json({
      success: true,
      data: jobs
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const jobs = await Job.find({
      category: category,
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 // अपने Job Model का सही पाथ यहाँ डालें

const getidjobs = async (req, res) => {
  try {
    // फ्रंटएंड से भेजी गई यूजर (Employer) की आईडी req.params.id से मिलेगी
    const employerId = req.params.id;

    if (!employerId) {
      return res.status(400).json({
        success: false,
        message: "Employer ID is required!",
      });
    }

    // डेटाबेस में 'employerId' फ़ील्ड से मैच करने वाली केवल इस यूजर की जॉब्स ढूंढें
    // .populate('employerId') से कंपनी का नाम और लोगो भी साथ आ जाएगा
    const jobs = await Job.find({ employerId: employerId }).populate('employerId');

    // फ्रंटएंड 'data.data' रीड कर रहा है, इसलिए की (Key) का नाम 'data' ही रखें
    res.json({
      success: true,
      data: jobs, 
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};






module.exports = {
  postjob,
  managejob,
  managejobb,applyJob,getApplicants,myApplications,getApplicationDetails,updateApplicationStatus,getEmployerJobs,getJobsByCategory,getidjobs
};