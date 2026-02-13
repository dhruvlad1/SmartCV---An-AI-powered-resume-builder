import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResumePreview from "../../components/resume/ResumePreview";
import { updateResume } from "../../services/resumeService";
import { useResume } from "../componenets/ResumeContext";
import { previewResume } from "../../data/temp";
import "./TemplateSelect.css";
import "../../styles/shared/workspace.css";

/** Minimal data so template shows structure/headings only (no sample content) */
const templateOnlyData = {
  name: "Your Name",
  title: "Your Title",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  summary: "",
  experience: [
    { role: "", company: "", location: "", year: "", description: [] },
  ],
  education: [
    { degree: "", institute: "", location: "", year: "", gpa: "", honors: "" },
  ],
  skills: [],
  projects: [{ name: "", description: "", tech: [], year: "" }],
  certifications: [],
};

const PREVIEW_MODE = {
  TEMPLATE_ONLY: "template-only",
  SAMPLE_DATA: "sample-data",
};

const TEMPLATES = [
  {
    id: "jakes-classic",
    name: "Jake's Resume",
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
  const [selectedTemplate, setSelectedTemplate] = useState("jakes-classic");
  const [previewMode, setPreviewMode] = useState(PREVIEW_MODE.SAMPLE_DATA);
  const { setResumeData } = useResume();

  const handleContinue = async () => {
    try {
      // 1. Update the template field for this specific resume in MongoDB
      await updateResume(resumeId, { template: selectedTemplate });

      // 2. Update local Context state so the Editor is in sync
      setResumeData((prev) => ({
        ...prev,
        template: selectedTemplate,
      }));

      // 3. Move to the main Editor workspace
      navigate(`/builder/${resumeId}`);
    } catch (error) {
      console.error("Error saving template selection:", error);
      alert("Failed to save template. Please try again.");
    }
  };

  const previewData =
    previewMode === PREVIEW_MODE.SAMPLE_DATA ? previewResume : templateOnlyData;

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

                {isSelected && <p className="selected-check">✓ Selected</p>}
              </div>
            );
          })}
        </div>

        {/* RIGHT: Live Preview */}
        <div className="preview-shell">
          <div className="preview-mode-tabs">
            <button
              type="button"
              className={`preview-mode-btn ${
                previewMode === PREVIEW_MODE.TEMPLATE_ONLY ? "active" : ""
              }`}
              onClick={() => setPreviewMode(PREVIEW_MODE.TEMPLATE_ONLY)}
            >
              Template only
            </button>
            <button
              type="button"
              className={`preview-mode-btn ${
                previewMode === PREVIEW_MODE.SAMPLE_DATA ? "active" : ""
              }`}
              onClick={() => setPreviewMode(PREVIEW_MODE.SAMPLE_DATA)}
            >
              With sample data
            </button>
          </div>
          <div className="preview-paper">
            <ResumePreview template={selectedTemplate} data={previewData} />
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
          Continue to Editor →
        </button>
      </div>
    </div>
  );
}
