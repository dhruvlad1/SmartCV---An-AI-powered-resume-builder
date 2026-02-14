import axios from "axios";

// Set up axios to send cookies (for your JWT token)
const API = axios.create({
  baseURL: "http://localhost:5000/api/resumes",
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

// 4. Fetch a SINGLE resume by ID (Newly Added)
// This is what the Editor component uses to load your data on refresh
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
    // We point to /api/ai/enhance as defined in your backend
    const response = await axios.post(
      "http://localhost:5000/api/ai/enhance",
      { text, type },
      { withCredentials: true }, // Crucial for authMiddleware to work
    );
    return response.data.enhancedText;
  } catch (error) {
    console.error("AI Enhancement Error:", error);
    throw error;
  }
};

export const deleteResume = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/resumes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete resume");
  return await response.json();
};