import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { Plus, AlertCircle } from "lucide-react";
import "./dashboard.css";

const CreateResumeBtn = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleCreateClick = () => {
    const user = auth.currentUser;

    if (user) {
      // Logic for logged in users
      navigate("/project-choice");
    } else {
      // Trigger the notification
      setShowToast(true);

      // Wait 2 seconds so they can read it, then redirect
      setTimeout(() => {
        setShowToast(false);
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="create-resume-wrapper">
      {/* The Notification Message */}
      {showToast && (
        <div className="login-toast">
          <AlertCircle size={18} />
          <span>Please login to create a resume</span>
        </div>
      )}

      <button className="create-resume-btn" onClick={handleCreateClick}>
        <Plus size={20} strokeWidth={2.5} />
        <span>Create New Resume</span>
      </button>
    </div>
  );
};

export default CreateResumeBtn;
