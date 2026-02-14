import { useState } from "react";
import SectionCard from "./SectionCard";
import "./Editor.css";
import "../../App.css";
import { updateResume, enhanceText } from "../../services/resumeService";
// --- NEW ICON IMPORTS ---
import { Sparkles, Plus, Trash2, LayoutGrid } from "lucide-react";

const EditorPanel = ({ resumeData = {}, setResumeData, addCustomSection }) => {
  const [loadingField, setLoadingField] = useState(null);

  // --- AI HANDLER ---
  const handleAIPolish = async (field, currentValue, type, index = null) => {
    if (!currentValue || currentValue.trim() === "") {
      return alert("Please type something first so the AI can enhance it!");
    }

    const loadingKey = index !== null ? `${field}-${index}` : field;
    setLoadingField(loadingKey);

    try {
      const polished = await enhanceText(currentValue, type);

      if (index !== null) {
        const updatedArray = [...(resumeData[field] || [])];
        if (type === "description") {
          updatedArray[index].description = polished
            .split("\n")
            .map((s) => s.replace(/^[•*-]\s*/, "").trim())
            .filter((s) => s !== "");
        } else {
          updatedArray[index][type] = polished;
        }
        setResumeData({ ...resumeData, [field]: updatedArray });
      } else {
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
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <LayoutGrid size={22} className="title-icon" /> Content Editor
        </h2>
        <button className="secondary-btn" onClick={addCustomSection}>
          <Plus size={16} /> Add Custom Section
        </button>
      </div>

      {/* PERSONAL INFO */}
      <SectionCard title={"Personal Information"}>
        <input
          type="text"
          placeholder="Full Name"
          value={resumeData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          type="text"
          placeholder="Professional Title (optional)"
          value={resumeData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <div className="input-grid">
          <input
            type="text"
            placeholder="Phone"
            value={resumeData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={resumeData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div className="input-grid">
          <input
            type="text"
            placeholder="LinkedIn URL"
            value={resumeData.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
          />
          <input
            type="text"
            placeholder="GitHub URL"
            value={resumeData.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
          />
        </div>
        <input
          type="text"
          placeholder="Location (City, Country) — optional"
          value={resumeData.location || ""}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </SectionCard>

      {/* SUMMARY */}
      <SectionCard title={"Summary"}>
        <div className="ai-container">
          <button
            className="ai-polish-btn"
            disabled={loadingField === "summary"}
            onClick={() =>
              handleAIPolish("summary", resumeData.summary, "summary")
            }
          >
            {loadingField === "summary" ? (
              <>
                <Sparkles size={16} className="spinning" /> Enhancing...
              </>
            ) : (
              <>
                <Sparkles size={16} /> AI Polish
              </>
            )}
          </button>
          <textarea
            placeholder="Write a brief overview of your career..."
            value={resumeData.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
          />
        </div>
      </SectionCard>

      {/* EDUCATION */}
      <SectionCard title={"Education"}>
        {resumeData.education?.map((edu, i) => (
          <div key={i} className="editor-nested-card">
            <input
              type="text"
              placeholder="Institute"
              value={edu.institute || ""}
              onChange={(e) =>
                updateArrayField("education", i, "institute", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree || ""}
              onChange={(e) =>
                updateArrayField("education", i, "degree", e.target.value)
              }
            />
            <div className="input-grid">
              <input
                type="text"
                placeholder="Location"
                value={edu.location || ""}
                onChange={(e) =>
                  updateArrayField("education", i, "location", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Year"
                value={edu.year || ""}
                onChange={(e) =>
                  updateArrayField("education", i, "year", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="GPA (optional)"
                value={edu.gpa || ""}
                onChange={(e) =>
                  updateArrayField("education", i, "gpa", e.target.value)
                }
              />
            </div>
            <button
              className="remove-btn"
              onClick={() => removeItem("education", i)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          className="add-btn"
          onClick={() =>
            addItem("education", {
              institute: "",
              degree: "",
              location: "",
              year: "",
              gpa: "",
              honors: "",
            })
          }
        >
          <Plus size={18} /> Add Education
        </button>
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
            <div className="input-grid">
              <input
                type="text"
                placeholder="Location"
                value={job.location || ""}
                onChange={(e) =>
                  updateArrayField("experience", i, "location", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Year (e.g. 2021 – Present)"
                value={job.year || ""}
                onChange={(e) =>
                  updateArrayField("experience", i, "year", e.target.value)
                }
              />
            </div>

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
                {loadingField === `experience-${i}` ? (
                  <>
                    <Sparkles size={14} className="spinning" /> Polishing...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> AI Polish Points
                  </>
                )}
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
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          className="add-btn"
          onClick={() =>
            addItem("experience", {
              role: "",
              company: "",
              location: "",
              year: "",
              description: [],
            })
          }
        >
          <Plus size={18} /> Add Experience
        </button>
      </SectionCard>

      {/* PROJECTS */}
      <SectionCard title={"Projects"}>
        {resumeData.projects?.map((proj, i) => (
          <div key={i} className="editor-nested-card">
            <input
              type="text"
              placeholder="Project Name"
              value={proj.name || ""}
              onChange={(e) =>
                updateArrayField("projects", i, "name", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Year"
              value={proj.year || ""}
              onChange={(e) =>
                updateArrayField("projects", i, "year", e.target.value)
              }
            />
            <textarea
              placeholder="Description"
              value={proj.description || ""}
              onChange={(e) =>
                updateArrayField("projects", i, "description", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Tech stack (comma separated)"
              value={Array.isArray(proj.tech) ? proj.tech.join(", ") : ""}
              onChange={(e) => {
                const updated = [...(resumeData.projects || [])];
                updated[i].tech = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                setResumeData({ ...resumeData, projects: updated });
              }}
            />
            <button
              className="remove-btn"
              onClick={() => removeItem("projects", i)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          className="add-btn"
          onClick={() =>
            addItem("projects", {
              name: "",
              year: "",
              description: "",
              tech: [],
            })
          }
        >
          <Plus size={18} /> Add Project
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
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
        />
      </SectionCard>

      {/* ACHIEVEMENTS */}
      <SectionCard title={"Achievements"}>
        {resumeData.achievements?.map((ach, i) => (
          <div key={i} className="editor-nested-card">
            <input
              type="text"
              placeholder="Title / Award"
              value={ach.title || ""}
              onChange={(e) =>
                updateArrayField("achievements", i, "title", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Year (optional)"
              value={ach.year || ""}
              onChange={(e) =>
                updateArrayField("achievements", i, "year", e.target.value)
              }
            />
            <textarea
              placeholder="Description"
              value={ach.description || ""}
              onChange={(e) =>
                updateArrayField(
                  "achievements",
                  i,
                  "description",
                  e.target.value,
                )
              }
            />
            <button
              className="remove-btn"
              onClick={() => removeItem("achievements", i)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          className="add-btn"
          onClick={() =>
            addItem("achievements", { title: "", description: "", year: "" })
          }
        >
          <Plus size={18} /> Add Achievement
        </button>
      </SectionCard>

      {/* CERTIFICATIONS */}
      <SectionCard title={"Certifications (optional)"}>
        {resumeData.certifications?.map((cert, i) => (
          <div key={i} className="editor-nested-card">
            <input
              type="text"
              placeholder="Certification Name"
              value={cert.name || ""}
              onChange={(e) =>
                updateArrayField("certifications", i, "name", e.target.value)
              }
            />
            <div className="input-grid">
              <input
                type="text"
                placeholder="Issuer"
                value={cert.issuer || ""}
                onChange={(e) =>
                  updateArrayField(
                    "certifications",
                    i,
                    "issuer",
                    e.target.value,
                  )
                }
              />
              <input
                type="text"
                placeholder="Year"
                value={cert.year || ""}
                onChange={(e) =>
                  updateArrayField("certifications", i, "year", e.target.value)
                }
              />
            </div>
            <button
              className="remove-btn"
              onClick={() => removeItem("certifications", i)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          className="add-btn"
          onClick={() =>
            addItem("certifications", { name: "", issuer: "", year: "" })
          }
        >
          <Plus size={18} /> Add Certification
        </button>
      </SectionCard>

      {/* CUSTOM SECTIONS */}
      {resumeData.customSections?.map((sec, secIndex) => (
        <SectionCard key={secIndex} title={sec.title || "New Section"}>
          <input
            type="text"
            placeholder="Section Title"
            value={sec.title || ""}
            onChange={(e) =>
              updateArrayField(
                "customSections",
                secIndex,
                "title",
                e.target.value,
              )
            }
          />
          {sec.items?.map((item, itemIndex) => (
            <textarea
              key={itemIndex}
              placeholder="Enter details"
              value={item}
              onChange={(e) => {
                const updated = [...(resumeData.customSections || [])];
                updated[secIndex].items[itemIndex] = e.target.value;
                setResumeData({ ...resumeData, customSections: updated });
              }}
            />
          ))}
          <button
            className="remove-btn"
            onClick={() => removeItem("customSections", secIndex)}
          >
            <Trash2 size={16} />
          </button>
        </SectionCard>
      ))}
    </section>
  );
};

export default EditorPanel;
