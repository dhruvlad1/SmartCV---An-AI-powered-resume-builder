import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResumes, createResume } from "../services/resumeService";

export default function ProjectChoice() {
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch existing resumes
    getResumes().then(setResumes);
  }, []);

  const handleCreateNew = async () => {
    const resume = await createResume();
    navigate(`/templates/${resume._id}`);
  };

  return (
    <div>
      <h1>Choose a Resume</h1>

      {/* Existing resumes */}
      <div>
        {resumes.map((resume) => (
          <div key={resume._id}>
            <p>{resume.title}</p>
            <button onClick={() => navigate(`/builder/${resume._id}`)}>
              Open
            </button>
          </div>
        ))}
      </div>

      {/* Create new */}
      <button onClick={handleCreateNew}>
        + Create New Resume
      </button>
    </div>
  );
}
