const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const Admin = require("./model/Admin");

const authRoutes = require("./routes/authRoutes");
const seekerRoutes = require("./routes/seekerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const AdminRoutes = require("./routes/AdminRoutes");

const app = express();

// ===============================
// CORS
// ===============================
// ===============================
// CORS
// ===============================
app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / server-to-server request
      if (!origin) {
        return callback(null, true);
      }

      // Live frontend + any localhost port
      const allowed =
        origin === "https://latestjobportal-1.onrender.com" ||
        /^http:\/\/localhost:\d+$/.test(origin);

      if (allowed) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  })
);
// ===============================
// Middleware
// ===============================
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ===============================
// Routes
// ===============================
app.use("/api", authRoutes);
app.use("/api", seekerRoutes);
app.use("/api", categoryRoutes);
app.use("/api", contactRoutes);
app.use("/api", AdminRoutes);

// ===============================
// Test Route
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Job Portal Backend is running",
  });
});

// ===============================
// Create Default Admin
// ===============================
async function createAdmin() {
  try {
    const admin = await Admin.findOne({
      email: "admin@gmail.com",
    });

    if (!admin) {
      const hash = await bcrypt.hash("krishna123", 10);

      await Admin.create({
        email: "admin@gmail.com",
        password: hash,
      });

      console.log("✅ Admin Created Successfully");
    } else {
      console.log("ℹ️ Admin Already Exists");
    }
  } catch (err) {
    console.log("❌ Error Creating Admin:", err);
  }
}

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(
    "mongodb+srv://krishnathuniya_db_user:krishna@cluster0.6yreqku.mongodb.net/jobportal?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(async () => {
    console.log("✅ MongoDB Connected");

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    await createAdmin();

    app.listen(process.env.PORT || 2340, () => {
      console.log(
        `🚀 Server running on port ${process.env.PORT || 2340}`
      );
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });