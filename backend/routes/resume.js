const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// 1. SAVE/CREATE a new resume
// Called when clicking "Create New" - adds a new entry to the user's array
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // The resume object from frontend (title, template, name, etc.)
    const newResume = {
      ...req.body,
      lastModified: Date.now(),
    };

    user.resumes.push(newResume);
    await user.save();

    // Return the newly created resume (including its generated _id)
    res.status(201).json(user.resumes[user.resumes.length - 1]);
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: "Failed to save resume" });
  }
});

// 2. GET ALL resumes for the dashboard
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.resumes || []);
  } catch (err) {
    console.error("Fetch All Error:", err);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

// 3. GET A SINGLE resume by ID
// Crucial for the Editor page when it loads via /builder/:resumeId
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Mongoose helper to find a sub-document by its _id
    const resume = user.resumes.id(req.params.id);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json(resume);
  } catch (err) {
    console.error("Fetch Single Error:", err);
    res.status(500).json({ error: "Failed to fetch resume details" });
  }
});

// 4. UPDATE an existing resume
// Called when clicking "Save Changes" in the Editor or after AI Polish
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const resume = user.resumes.id(req.params.id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    // Merge the new data from the frontend into the existing resume
    Object.assign(resume, req.body);
    resume.lastModified = Date.now();

    await user.save();
    res.json(resume);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update resume" });
  }
});

// 5. DELETE a resume (Handy for the Dashboard)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.resumes.pull(req.params.id); // Removes the sub-document
    await user.save();

    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete resume" });
  }
});

module.exports = router;
