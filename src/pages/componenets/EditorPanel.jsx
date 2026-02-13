import { useState } from "react";
import SectionCard from "./SectionCard";
import "./Editor.css";
import "../../App.css";
import { updateResume, enhanceText } from "../../services/resumeService";

const EditorPanel = ({ resumeData = {}, setResumeData, addCustomSection }) => {
  const [loadingField, setLoadingField] = useState(null);

  // --- AI HANDLER ---
  const handleAIPolish = async (field, currentValue, type, index = null) => {
    if (!currentValue || currentValue.trim() === "") {
      return alert("Please type something first so the AI can enhance it!");
    }

    // Set a unique loading key (e.g., "summary" or "experience-0")
    const loadingKey = index !== null ? `${field}-${index}` : field;
    setLoadingField(loadingKey);

    try {
      const polished = await enhanceText(currentValue, type);

      if (index !== null) {
        // Handle array fields (Experience)
        const updatedArray = [...(resumeData[field] || [])];

        if (type === "description") {
          // Split AI response by new lines and clean up any extra bullet characters
          updatedArray[index].description = polished
            .split("\n")
            .map((s) => s.replace(/^[•*-]\s*/, "").trim())
            .filter((s) => s !== "");
        } else {
          updatedArray[index][type] = polished;
        }

        setResumeData({ ...resumeData, [field]: updatedArray });
      } else {
        // Handle top-level fields (Summary)
        setResumeData({ ...resumeData, [field]: polished });
      }
    } catch (err) {
      console.error("AI Error:", err);
      alert("Failed to connect to Gemini. Make sure your backend is running.");
    } finally {
      setLoadingField(null);
    }
  };

  // --- STANDARD HANDLERS ---
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

      {/* SUMMARY WITH AI */}
      <SectionCard title={"Professional Summary"}>
        <div className="ai-container">
          <button
            className="ai-polish-btn"
            disabled={loadingField === "summary"}
            onClick={() =>
              handleAIPolish("summary", resumeData.summary, "summary")
            }
          >
            {loadingField === "summary" ? "✨ Enhancing..." : "✨ AI Polish"}
          </button>
          <textarea
            placeholder="Write a brief overview of your career..."
            value={resumeData.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
          />
        </div>
      </SectionCard>

      {/* EXPERIENCE WITH AI */}
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

            <div className="ai-container" style={{ marginTop: "10px" }}>
              <button
                className="ai-small-btn"
                disabled={loadingField === `experience-${i}`}
                onClick={() =>
                  handleAIPolish(
                    "experience",
                    job.description?.join("\n"),
                    "description",
                    i,
                  )
                }
              >
                {loadingField === `experience-${i}`
                  ? "✨ Polishing..."
                  : "✨ AI Polish Points"}
              </button>
              <textarea
                placeholder="Responsibilities (Each line becomes a bullet point)"
                value={job.description?.join("\n") || ""}
                onChange={(e) =>
                  handleDescriptionChange("experience", i, e.target.value)
                }
              />
            </div>

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
