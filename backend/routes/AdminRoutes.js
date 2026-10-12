
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

const {
  adminLogin,
  getAdmin,
  updateAdmin,
} = require("../authcontroller/admincontroller");

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "job-portal/admin",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit" },
    ],
  },
});

// Multer Upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
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

// ADMIN ROUTES
router.post("/admin-login", adminLogin);

router.get("/admin", getAdmin);

router.put("/admin", upload.single("image"), updateAdmin);

module.exports = router;
