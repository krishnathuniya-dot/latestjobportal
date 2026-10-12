
const express = require("express");
const router = express.Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const {
  register,
  getUser,
  updateUser,
  changePassword,
  login,
  getEmployerById,
  getEmployers,
  resetPassword,
  verifyOtp,
  sendOtp,
} = require("../authcontroller/usercontroller");

const {
  postjob,
  managejob,
  managejobb,
  applyJob,
  getApplicants,
  myApplications,
  getApplicationDetails,
  getJobsByCategory,
  updateApplicationStatus,
  getEmployerJobs,
  getidjobs,
} = require("../authcontroller/Jobcontroller");

// =====================================
// CLOUDINARY STORAGE
// =====================================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "job-portal/company-logos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit" },
    ],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG and WEBP images are allowed")
      );
    }

    cb(null, true);
  },
});

// =====================================
// EMPLOYER / USER ROUTES
// =====================================
router.post("/register", upload.single("logo"), register);

router.get("/user/:id", getUser);

router.put(
  "/update/:id",
  upload.single("logo"),
  updateUser
);

router.put("/changepassword/:id", changePassword);
router.post("/login", login);

router.get("/employer", getEmployers);
router.get("/employer/:id", getEmployerById);

router.post("/forgot-password", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// =====================================
// JOB ROUTES
// =====================================
router.post("/postjob", postjob);
router.get("/managejob", managejob);
router.get("/managejob/:id", managejobb);
router.get("/managejobb/:employerId", getEmployerJobs);
router.get("/category/:category", getJobsByCategory);
router.get("/alljobs/:id", getidjobs);

// =====================================
// APPLICATION ROUTES
// =====================================
router.post("/applyjob", applyJob);
router.get("/applicants/:jobId", getApplicants);
router.get("/my-applications/:candidateId", myApplications);
router.get("/application-details/:id", getApplicationDetails);

router.put(
  "/update-application/:id",
  updateApplicationStatus
);

module.exports = router;
