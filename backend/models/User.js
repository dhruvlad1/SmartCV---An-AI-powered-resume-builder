const mongoose = require("mongoose");

// This schema mirrors your ResumeContext.jsx state
const resumeSchema = new mongoose.Schema({
  title: { type: String, default: "New Resume" },
  template: { type: String, default: "jakes-classic" },
  name: String,
  professionalTitle: String,
  email: String,
  phone: String,
  location: String,
  linkedin: String,
  github: String,
  summary: String,
  experience: [
    {
      role: String,
      company: String,
      location: String,
      year: String,
      description: [String], // Array of strings for bullet points
    },
  ],
  education: [
    {
      institute: String,
      degree: String,
      location: String,
      year: String,
      gpa: String,
      honors: String,
    },
  ],
  projects: [
    {
      name: String,
      year: String,
      description: String,
      tech: [String],
    },
  ],
  skills: [String],
  achievements: [
    {
      title: String,
      description: String,
      year: String,
    },
  ],
  certifications: [
    {
      name: String,
      issuer: String,
      year: String,
    },
  ],
  customSections: [
    {
      title: String,
      items: [String],
    },
  ],
  lastModified: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    // This allows one user to have many resumes
    resumes: [resumeSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
