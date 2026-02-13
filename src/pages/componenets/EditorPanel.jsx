import { useState } from "react";
import SectionCard from "./SectionCard";
import "./Editor.css";
import "../../App.css";
// FIXED: Path corrected (pages/componenets to services is two steps up)
import { updateResume } from "../../services/resumeService";
// import { enhanceText } from "../../services/resumeService"; // Uncomment when AI is ready

const EditorPanel = ({ resumeData = {}, setResumeData, addCustomSection }) => {
  const [loadingField, setLoadingField] = useState(null);

  // AI HANDLER - Placeholder to prevent build errors
  const handleAIPolish = async (field, currentValue, type, index = null) => {
    alert("AI features will be enabled after the Gemini API is connected!");
  };

  // HANDLERS
  const handleChange = (field, value) =>
    setResumeData({ ...resumeData, [field]: value });

  const updateArrayField = (section, index, field, value) => {
    const updated = [...(resumeData[section] || [])];
    updated[index][field] = value;
    setResumeData({ ...resumeData, [section]: updated });
  };

  const handleDescriptionChange = (section, index, value) => {
    const updated = [...(resumeData[section] || [])];
    updated[index].description = value.split("\n");
    setResumeData({ ...resumeData, [section]: updated });
  };

  const addItem = (section, template) => {
    setResumeData({
      ...resumeData,
      [section]: [...(resumeData[section] || []), template],
    });
  };

  const removeItem = (section, index) => {
    const updated = resumeData[section].filter((_, i) => i !== index);
    setResumeData({ ...resumeData, [section]: updated });
  };

  return (
    <section className="editor-panel">
      <div className="panel-title">
        <h2>Content Editor</h2>
        <button className="secondary-btn" onClick={addCustomSection}>
          + Add Custom Section
        </button>
      </div>

      {/* PERSONAL INFO */}
      <SectionCard title={"Personal Information"}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Full Name"
            value={resumeData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <input
            type="text"
            placeholder="Professional Title (e.g. Software Engineer)"
            value={resumeData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>
      </SectionCard>

      {/* SUMMARY */}
      <SectionCard title={"Professional Summary"}>
        <div className="ai-container">
          <button
            className="ai-polish-btn"
            onClick={() =>
              handleAIPolish("summary", resumeData.summary, "summary")
            }
          >
            ✨ AI Polish (Coming Soon)
          </button>
          <textarea
            placeholder="Write a brief overview of your career..."
            value={resumeData.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
          />
        </div>
      </SectionCard>

      {/* EXPERIENCE */}
      <SectionCard title={"Experience"}>
        {resumeData.experience?.map((job, i) => (
          <div key={i} className="editor-nested-card">
            <input
              type="text"
              placeholder="Role"
              value={job.role || ""}
              onChange={(e) =>
                updateArrayField("experience", i, "role", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Company"
              value={job.company || ""}
              onChange={(e) =>
                updateArrayField("experience", i, "company", e.target.value)
              }
            />
            <textarea
              placeholder="Responsibilities (Each line becomes a bullet point)"
              value={job.description?.join("\n") || ""}
              onChange={(e) =>
                handleDescriptionChange("experience", i, e.target.value)
              }
            />
            <button
              className="remove-btn"
              onClick={() => removeItem("experience", i)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="add-btn"
          onClick={() =>
            addItem("experience", { role: "", company: "", description: [] })
          }
        >
          + Add Experience
        </button>
      </SectionCard>

      {/* SKILLS */}
      <SectionCard title={"Skills"}>
        <textarea
          placeholder="React, Node.js, Python, CSS (Separated by commas)"
          value={resumeData.skills?.join(", ") || ""}
          onChange={(e) =>
            handleChange(
              "skills",
              e.target.value.split(",").map((s) => s.trim()),
            )
          }
        />
      </SectionCard>
    </section>
  );
};

export default EditorPanel;
