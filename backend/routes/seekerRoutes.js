const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  registerJobSeeker,
  loginJobSeeker,getProfile,updateProfile,addEducation,addExperience,getJobseekers,getCandidatesBetweenDates
} = require("../authcontroller/seekercontroller");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");

// folder automatically create karega
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({ storage });

router.post(
  "/registerr",
  upload.single("resume"),
  registerJobSeeker
);

router.post("/loginn", loginJobSeeker);
router.get("/profile/:id", getProfile);
router.put(
  "/update-profile/:id",
  upload.single("profilePic"),
  updateProfile
);
router.post(
  "/add-education/:id",
  addEducation
);
router.post(
  "/add-experience/:id",
  addExperience
);
router.get(
  "/jobseekers",
  getJobseekers
);
router.post("/candidates-between-dates", getCandidatesBetweenDates);




module.exports = router;