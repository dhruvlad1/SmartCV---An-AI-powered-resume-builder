import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResumes } from "../../services/resumeService";
import "../../App.css";

const List = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getResumes();
        setResumes(data);
      } catch (error) {
        console.error("Failed to load resumes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  if (loading) return <div className="loading">Loading your resumes...</div>;

  return (
    <div className="resume-list-container">
      <h2 className="list-title">Your Resumes</h2>
      <div className="resume-grid">
        {resumes.length > 0 ? (
          resumes.map((resume) => (
            <div
              key={resume._id}
              className="resume-card"
              // FIXED: Changed /editor/ to /builder/ to match App.jsx routes
              onClick={() => navigate(`/builder/${resume._id}`)}
            >
              <div className="resume-card-icon">📄</div>
              <div className="resume-card-info">
                <h3>{resume.title || "Untitled Resume"}</h3>
                <p>
                  Last modified:{" "}
                  {resume.lastModified
                    ? new Date(resume.lastModified).toLocaleDateString()
                    : "Recently"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-resumes">
            No resumes found. Click the button above to create your first one!
          </p>
        )}
      </div>
    </div>
  );
};

export default List;
