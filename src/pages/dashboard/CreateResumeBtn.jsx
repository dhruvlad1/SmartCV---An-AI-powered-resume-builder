import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, LogIn, Loader2 } from "lucide-react";
import { createResume } from "../../services/resumeService";
import "./dashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CreateResumeBtn = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
        });
        if (isMounted) setUser(res.data);
      } catch {
        if (isMounted) setUser(null);
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateClick = async () => {
    if (!user || isCreating) return;

    setIsCreating(true);
    try {
      const newResumeData = {
        title: "Untitled Resume",
        template: "jakes-classic",
        name: user.username || "",
        email: user.email || "",
        experience: [],
        education: [],
        projects: [],
        skills: [],
        customSections: [], // Added to match your EditorPanel expectations
      };

      const savedResume = await createResume(newResumeData);

      // We use the ID in the URL for the next steps to ensure it's never lost
      // Route: /templates/:resumeId (as defined in your App.jsx)
      navigate(`/templates/${savedResume._id}`);
    } catch (error) {
      console.error("Creation failed:", error);
      alert("Could not create resume. Please check your connection.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleLoginClick = () => navigate("/login");

  return (
    <div className="create-resume-wrapper">
      {user ? (
        <button
          className="create-resume-btn"
          onClick={handleCreateClick}
          disabled={isCreating}
        >
          {isCreating ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            <Plus size={22} strokeWidth={2.5} />
          )}
          <span>{isCreating ? "Creating..." : "Create New Resume"}</span>
        </button>
      ) : (
        <div className="login-first-cta">
          <p className="login-first-text">
            Sign in or register to create and manage your resumes
          </p>
          <button className="start-creating-btn" onClick={handleLoginClick}>
            <LogIn size={20} strokeWidth={2.5} />
            <span>Start creating</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateResumeBtn;
