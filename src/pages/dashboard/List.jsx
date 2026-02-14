import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResumes } from "../../services/resumeService";
import "../../App.css";
import axios from "axios";

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

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?",
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/resumes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in header
          },
          withCredentials: true, // Send token in cookie (if backend requires it)
        },
      );

      if (response.status === 200 || response.status === 204) {
        setResumes((prev) => prev.filter((resume) => resume._id !== id));
      }
    } catch (error) {
      console.error("Delete Error:", error);
      const message = error.response?.data?.error || "Not authenticated";
      alert(`Error: ${message}`);
    }
  };

  if (loading) return <div className="loading">Loading your resumes...</div>;

  return (
    <div className="dashboard-content">
      {/* Google Docs Style Header (Owner Removed) */}
      {resumes.length > 0 && (
        <div className="docs-header-row">
          <div className="col-name">Recent documents</div>
          <div className="col-date">Last modified</div>
          <div className="col-actions"></div>
        </div>
      )}

      <div className="docs-list-container">
        {resumes.length > 0 ? (
          resumes.map((resume) => (
            <div
              key={resume._id}
              className="docs-list-row"
              onClick={() => navigate(`/builder/${resume._id}`)}
            >
              {/* Name Column */}
              <div className="col-name">
                <span className="docs-icon">📄</span>
                <span className="docs-title">
                  {resume.title || "Untitled Resume"}
                </span>
              </div>

              {/* Date Column */}
              <div className="col-date">
                {resume.lastModified
                  ? new Date(resume.lastModified).toLocaleDateString()
                  : "Recently"}
              </div>

              {/* Actions Column - Now with working Delete */}
              <div className="col-actions">
                <button
                  className="docs-more-btn delete-trigger"
                  onClick={(e) => handleDelete(e, resume._id)}
                  title="Delete Resume"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-resumes-box">
            <p className="no-resumes">
              No resumes found. Click the button above to create your first one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
