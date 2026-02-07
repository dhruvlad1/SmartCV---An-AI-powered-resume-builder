import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Plus, LogIn } from "lucide-react";
import "./dashboard.css";

const CreateResumeBtn = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateClick = () => {
    if (user) {
      navigate("/project-choice");
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="create-resume-wrapper">
      {user ? (
        <button className="create-resume-btn" onClick={handleCreateClick}>
          <Plus size={22} strokeWidth={2.5} />
          <span>Create New Resume</span>
        </button>
      ) : (
        <div className="login-first-cta">
          <p className="login-first-text">Sign in or register to create and manage your resumes</p>
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
