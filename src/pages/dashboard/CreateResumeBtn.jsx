import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogIn, Loader2 } from "lucide-react";
import { createResume } from "../../services/resumeService";
import { useAuth } from "../../context/AuthContext";
import "./dashboard.css";

const CreateResumeBtn = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ← reads from global context, no fetch needed
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Logged-in flow:
   *   1. Create a blank resume record in DB
   *   2. Navigate to /templates/:id  ← TemplateSelect
   *   3. User picks template → /builder/:id  ← Live Editor
   */
  const handleCreateClick = async () => {
    if (!user || isCreating) return;
    setIsCreating(true);

    try {
      const savedResume = await createResume({
        title: "Untitled Resume",
        template: "jakes-classic",
        name: user.username || "",
        email: user.email || "",
        experience: [],
        education: [],
        projects: [],
        skills: [],
        customSections: [],
      });

      // Go to template selection first, then on to the editor
      navigate(`/templates/${savedResume._id}`);
    } catch (error) {
      console.error("Creation failed:", error);
      alert("Could not create resume. Please check your connection.");
    } finally {
      setIsCreating(false);
    }
  };

  // Guest: redirect to login
  const handleGuestClick = () => navigate("/login");

  if (!user) {
    return (
      <div className="hero-guest-cta">
        <button className="cta-btn-primary" onClick={handleGuestClick}>
          <LogIn size={20} strokeWidth={2.5} />
          <span>Get Started — It's Free</span>
        </button>
        <p className="cta-sub">No credit card required</p>
      </div>
    );
  }

  return (
    <button
      className="cta-btn-primary"
      onClick={handleCreateClick}
      disabled={isCreating}
    >
      {isCreating ? (
        <>
          <Loader2 size={20} className="spin-icon" />
          <span>Setting up...</span>
        </>
      ) : (
        <>
          <Plus size={20} strokeWidth={2.5} />
          <span>Create New Resume</span>
        </>
      )}
    </button>
  );
};

export default CreateResumeBtn;
