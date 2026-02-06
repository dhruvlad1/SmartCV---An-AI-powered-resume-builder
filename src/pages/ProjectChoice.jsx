import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResumes, createResume } from "../services/resumeService";

export default function ProjectChoice() {
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getResumes().then(setResumes);
  }, []);

  const handleCreateNew = async () => {
    const resume = await createResume();
    navigate(`/templates/${resume._id}`);
  };

  return (
    <div className="workspace">

      {/* HEADER */}
      <header className="workspace-header">
        <h1>Your Resumes</h1>
        <p>
          Continue working on an existing resume or start a new one.
        </p>
      </header>

      {/* EXISTING RESUMES */}
      {resumes.length > 0 ? (
        <>
          <div className="resume-grid">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="resume-card"
                onClick={() => navigate(`/builder/${resume._id}`)}
              >
                <h3>{resume.title || "Untitled Resume"}</h3>
                <p>
                  {resume.lastEdited 
                    ? `Last edited ${new Date(resume.lastEdited).toLocaleDateString()}`
                    : "Last edited recently"}
                </p>
              </div>
            ))}
          </div>

          {/* DIVIDER */}
          <div className="workspace-divider">OR</div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <h3>No Previous Resumes</h3>
          <p>You haven't created any resumes yet. Start building your first resume now!</p>
        </div>
      )}

      {/* CREATE NEW */}
      <div
        className="resume-card create-card"
        onClick={handleCreateNew}
      >
        <span>＋</span>
        <h3>Create New Resume</h3>
        <p>Start from a proven template</p>
      </div>

    </div>
  );
}
