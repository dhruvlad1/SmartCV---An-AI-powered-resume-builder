import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResumePreview from "../components/resume/ResumePreview";
import { setTemplate } from "../services/resumeService";

const TEMPLATES = [
  {
    id: "jakes-classic",
    name: "Jake’s Resume",
    desc: "Industry-standard academic & SWE resume",
  },
  {
    id: "modern",
    name: "Modern Professional",
    desc: "Two-column layout for industry roles",
  },
  {
    id: "minimal",
    name: "Minimal ATS",
    desc: "Clean, compact, ATS-friendly format",
  },
];

export default function TemplateSelect() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleContinue = async () => {
    await setTemplate(resumeId, selectedTemplate);
    navigate(`/builder/${resumeId}`);
  };

  return (
    <div className="workspace">

      {/* HEADER */}
      <header className="workspace-header">
        <h1>Choose a Resume Template</h1>
        <p>
          Preview how your resume will look. You can change this later as per
          your details.
        </p>
      </header>

      {/* MAIN CONTENT */}
      <div className="workspace-content">

        {/* LEFT: Template list */}
        <div className="template-list">
          {TEMPLATES.map((tpl) => {
            const isSelected = selectedTemplate === tpl.id;

            return (
              <div
                key={tpl.id}
                className={`template-card ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedTemplate(tpl.id)}
              >
                <h3>{tpl.name}</h3>
                <p>{tpl.desc}</p>

                {isSelected && (
                  <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
                    ✓ Selected
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT: Live Preview */}
        <div className="preview-shell">
          <div className="preview-paper">
            <ResumePreview template={selectedTemplate} />
          </div>
        </div>

      </div>

      {/* FOOTER ACTION */}
      <div className="workspace-footer">
        <button
          className="primary-btn"
          disabled={!selectedTemplate}
          onClick={handleContinue}
        >
          Continue →
        </button>
      </div>

    </div>
  );
}
