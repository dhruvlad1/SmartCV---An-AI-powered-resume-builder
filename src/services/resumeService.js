import axios from "axios";

/**
 * This variable checks your environment.
 * If the app is running on Vercel, it uses the VITE_API_URL variable you set.
 * If you are working locally, it falls back to http://localhost:5000.
 */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Set up axios instance for resumes
const API = axios.create({
  baseURL: `${BASE_URL}/api/resumes`,
  withCredentials: true,
});

// 1. Fetch real resumes from MongoDB for the Dashboard
export const getResumes = async () => {
  try {
    const response = await API.get("/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return [];
  }
};

// 2. Create and Save a new resume to MongoDB
export const createResume = async (resumeData) => {
  try {
    const response = await API.post("/save", resumeData);
    return response.data; // Returns the new resume with its MongoDB _id
  } catch (error) {
    console.error("Error creating resume:", error);
    throw error;
  }
};

// 3. Update an existing resume
export const updateResume = async (resumeId, resumeData) => {
  try {
    const response = await API.put(`/update/${resumeId}`, resumeData);
    return response.data;
  } catch (error) {
    console.error("Error updating resume:", error);
    throw error;
  }
};

// 4. Fetch a SINGLE resume by ID
export const getResumeById = async (resumeId) => {
  try {
    const response = await API.get(`/${resumeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching single resume:", error);
    throw error;
  }
};

// 5. AI Enhancement - Sends text to Gemini for professional polishing
export const enhanceText = async (text, type) => {
  try {
    // Uses the dynamic BASE_URL instead of hardcoded localhost
    const response = await axios.post(
      `${BASE_URL}/api/ai/enhance`,
      { text, type },
      { withCredentials: true },
    );
    return response.data.enhancedText;
  } catch (error) {
    console.error("AI Enhancement Error:", error);
    throw error;
  }
};

// 6. Delete Resume
export const deleteResume = async (id) => {
  try {
    const token = localStorage.getItem("token");
    // Updated to use the consistent BASE_URL and standard fetch pattern
    const response = await fetch(`${BASE_URL}/api/resumes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete resume");
    return await response.json();
  } catch (error) {
    console.error("Delete Error:", error);
    throw error;
  }
};
