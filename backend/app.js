require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");
// const aiRoutes = require("./routes/ai"); // Commented out until you create this file

const app = express();

// Middleware
// Increased limit for JSON to handle complex resume data/images
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// Enable CORS for the Vite dev server and allow cookies (Crucial for Auth)
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vite Frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Route Middlewares
app.use("/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
// app.use("/api/ai", aiRoutes); // Commented out until you are ready for the Gemini part

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error(err);
  });

// Basic Health Check Route
app.get("/", (req, res) => {
  res.send("SmartCV backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
