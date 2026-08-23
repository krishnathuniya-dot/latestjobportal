const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  adminLogin,
  getAdmin,
  updateAdmin,
} = require("../authcontroller/admincontroller");

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/admin");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

// Routes
router.post("/admin-login", adminLogin);

router.get("/admin", getAdmin);

router.put("/admin", upload.single("image"), updateAdmin);

module.exports = router;