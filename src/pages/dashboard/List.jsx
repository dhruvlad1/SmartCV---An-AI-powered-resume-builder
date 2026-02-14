import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResumes } from "../../services/resumeService";
import "../../App.css";
import axios from "axios";
// --- NEW ICON IMPORTS ---
import { Search, FileText, Trash2, Clock } from "lucide-react";

const List = ({ searchQuery }) => {
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

  // --- DELETE LOGIC ---
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
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
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

  // --- SEARCH FILTERING LOGIC ---
  const filteredResumes = resumes.filter((resume) => {
    const title = resume.title || "Untitled Resume";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) return <div className="loading">Loading your resumes...</div>;

  return (
    <div className="dashboard-content">
      {/* Table Header */}
      {resumes.length > 0 && (
        <div className="docs-header-row">
          <div className="col-name">Recent documents</div>
          <div className="col-date">Last modified</div>
          <div className="col-actions"></div>
        </div>
      )}

      <div className="docs-list-container">
        {filteredResumes.length > 0 ? (
          filteredResumes.map((resume) => (
            <div
              key={resume._id}
              className="docs-list-row"
              onClick={() => navigate(`/builder/${resume._id}`)}
            >
              {/* Name Column */}
              <div className="col-name">
                <FileText size={18} className="docs-icon-svg" color="#06B6D4" />
                <span className="docs-title">
                  {resume.title || "Untitled Resume"}
                </span>
              </div>

              {/* Date Column */}
              <div className="col-date">
                <Clock size={14} style={{ marginRight: "6px", opacity: 0.6 }} />
                {resume.lastModified
                  ? new Date(resume.lastModified).toLocaleDateString()
                  : "Recently"}
              </div>

              {/* Actions Column */}
              <div className="col-actions">
                <button
                  className="docs-more-btn delete-trigger"
                  onClick={(e) => handleDelete(e, resume._id)}
                  title="Delete Resume"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-resumes-box">
            <p className="no-resumes">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : "No resumes found. Click the button above to create your first one!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
