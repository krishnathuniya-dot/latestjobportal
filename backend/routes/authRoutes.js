const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  register,
  getUser,
  updateUser,
  changePassword,
  login,getEmployerById,getEmployers,resetPassword,verifyOtp,sendOtp
} = require("../authcontroller/usercontroller");

const {
  postjob,
  managejob,
  managejobb,applyJob,getApplicants,myApplications,getApplicationDetails,getJobsByCategory,updateApplicationStatus,getEmployerJobs,
  
 
  getidjobs
} = require("../authcontroller/Jobcontroller");


// Create uploads folder automatically
const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}


// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});


// Routes
router.post(
  "/register",
  upload.single("logo"),
  register
);
router.get(
  "/applicants/:jobId",
  getApplicants
);
router.post("/applyjob", applyJob);
router.get(
  "/my-applications/:candidateId",
  myApplications
);
router.get(
  "/application-details/:id",
  getApplicationDetails
);

router.post("/login", login);
router.get("/user/:id", getUser);
router.put(
  "/update/:id",
  upload.single("logo"),
  updateUser
);
router.put("/changepassword/:id", changePassword);
router.put(
  "/update-application/:id",
  updateApplicationStatus
);
router.get(
  "/managejobb/:employerId",
  getEmployerJobs
);
router.get("/employer", getEmployers);
router.get("employer/:id", getEmployerById);
router.post("/forgot-password", sendOtp);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Reset Password
router.post("/reset-password", resetPassword);



router.post("/postjob", postjob);
router.get("/managejob", managejob);
router.get("/managejob/:id", managejobb);
router.get("/category/:category", getJobsByCategory);
router.get("/alljobs/:id", getidjobs);

module.exports = router;