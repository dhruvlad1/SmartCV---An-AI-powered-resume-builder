import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResumePreview from "../components/resume/ResumePreview";
import { setTemplate } from "../services/resumeService";

const TEMPLATES = [
  { id: "jakes-classic", name: "Jake’s Resume" },
  { id: "modern", name: "Modern" },
  { id: "minimal", name: "Minimal" },
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
    <div style={{ display: "flex", gap: "2rem" }}>
      
      {/* LEFT: Template list */}
      <div>
        <h2>Select a Template</h2>

        {TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => setSelectedTemplate(tpl.id)}
            style={{
              border: selectedTemplate === tpl.id ? "2px solid black" : "1px solid gray",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            {tpl.name}
          </div>
        ))}

        <button
          disabled={!selectedTemplate}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>

      {/* RIGHT: Live Preview */}
      <div style={{ flex: 1 }}>
        <ResumePreview template={selectedTemplate} />
      </div>

    </div>
  );
}
