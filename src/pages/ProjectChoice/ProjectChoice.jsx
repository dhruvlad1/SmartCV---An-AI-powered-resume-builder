import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResumes, createResume } from "../../services/resumeService";
import "./ProjectChoice.css";
import "../../styles/shared/workspace.css";

export default function ProjectChoice() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    getResumes().then((data) => {
      setResumes(data);
      setLoading(false);
    });
  }, []);

  const handleCreateNew = async () => {
    try {
      // Define a skeleton resume to initialize in MongoDB
      const skeletonData = {
        title: "Untitled Resume",
        template: "jakes-classic",
        experience: [],
        education: [],
        projects: [],
        skills: [],
      };

      const resume = await createResume(skeletonData);
      // Navigate to your template selection page with the new ID
      navigate(`/templates/${resume._id}`);
    } catch (error) {
      console.error("Failed to start new project", error);
    }
  };

  if (loading) return <div className="workspace">Loading projects...</div>;

  return (
    <div className="workspace">
      <div className="workspace-container">
        <header className="workspace-header">
          <h1>Your Resumes</h1>
          <p>Continue working on an existing resume or start a new one.</p>
        </header>

        {resumes.length > 0 ? (
          <>
            <div className="resume-grid">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="resume-card"
                  // Ensure this route matches your Editor.jsx route in App.jsx
                  onClick={() => navigate(`/editor/${resume._id}`)}
                >
                  <h3>{resume.title || "Untitled Resume"}</h3>
                  <p>
                    {resume.lastModified
                      ? `Last edited ${new Date(resume.lastModified).toLocaleDateString()}`
                      : "Last edited recently"}
                  </p>
                </div>
              ))}
            </div>
            <div className="workspace-divider">OR</div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <h3>No Previous Resumes</h3>
            <p>
              You haven't created any resumes yet. Start building your first
              resume now!
            </p>
          </div>
        )}

        <div className="create-new-container">
          <div className="resume-card create-card" onClick={handleCreateNew}>
            <span>＋</span>
            <h3>Create New Resume</h3>
            <p>Start from a proven template</p>
          </div>
        </div>
      </div>
    </div>
  );
}
