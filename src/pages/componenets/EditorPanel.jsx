// Main Panel containing collapsible section cards
// User enters information in each card

import SectionCard from "./SectionCard";
import "./Editor.css";
import "../../App.css";

// Panel receives: resumeData -> current state, setResumeData -> function to update state

const EditorPanel = ({ resumeData = {}, setResumeData, addCustomSection }) => {

    // Generic handler to update any field (eg - name, email, etc.)
    const handleChange = (field, value) => {
        setResumeData({ ...resumeData, [field]: value });
    };

    const updateArrayField = (section, index, field, value) => {
        const updated = [...resumeData[section]];
        updated[index][field] = value;
        setResumeData({ ...resumeData, [section]: updated });
    };

    const handleDescriptionChange = (section, index, value) => {
        const updated = [...resumeData[section]];
        updated[index].description = value.split("\n");
        setResumeData({ ...resumeData, [section]: updated })
    };

    const handleCSVChange = (field, value) => {
        setResumeData({ ...resumeData, [field]: value.split(',').map(s => s.trim()) });
    };

    // To add new work/education/project
    const addItem = (section, template) => {
        setResumeData({ ...resumeData, [section]: [...resumeData[section], template] });
    };

    // To remove work/education/project
    const removeItem = (section, index) => {
        const updated = resumeData[section].filter((_, i) => i != index);
        setResumeData({ ...resumeData, [section]: updated });
    }

    // To remove custom section
    const removeCustomSection = (index) => {
        const updated = resumeData.customSections.filter((_, i) => i != index);
        setResumeData({ ...resumeData, customSections: updated });
    }

    return (
        <section className="editor-panel">
            <div className="panel-title">
                <h2>Edit Resume</h2>
                <button onClick={addCustomSection}>Add Section</button>
            </div>

            {/* Personal Info */}
            <SectionCard title={'Personal Information'}>
                {/*resumeData.name || "" -> If name is entered, resumeData.name will be visible, else blank */}
                <input type="text" placeholder="Full Name" value={resumeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
                <input type="text" placeholder="Professional Title (eg. Software engineer)" value={resumeData.title || ""} onChange={(e) => handleChange("title", e.target.value)} />
                <div className="input-grid">
                    <input type="text" placeholder="Email" value={resumeData.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
                    <input type="text" placeholder="Phone Number" value={resumeData.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} />
                </div>
                <input type="text" placeholder="Location (City, Country)" value={resumeData.location || ""} onChange={(e) => handleChange("location", e.target.value)} />
                <div className="input-grid">
                    <input type="text" placeholder="LinkedIn URL" value={resumeData.linkedIn || ""} onChange={(e) => handleChange("linkedIn", e.target.value)} />
                    <input type="text" placeholder="GitHub URL" value={resumeData.github || ""} onChange={(e) => handleChange("github", e.target.value)} />
                </div>

            </SectionCard>

            {/* Professional Summary */}
            <SectionCard title={"Professional Summary"}>
                <textarea placeholder="Write a short professional summary describing your career goals and acheivements" value={resumeData.summary || ""} onChange={(e) => handleChange("summary", e.target.value)} />
            </SectionCard>

            {/* Work info */}
            <SectionCard title={"Experience"}>
                {resumeData.experience?.map((job, i) => (
                    <div key={i} className="editor-nested-card">
                        <input type="text" placeholder="Role / Job Title" value={job.role || ""} onChange={(e) => updateArrayField("experience", i, "role", e.target.value)} />
                        <input type="text" placeholder="Company" value={job.company || ""} onChange={(e) => updateArrayField("experience", i, "company", e.target.value)} />
                        <div className="input-grid">
                            <input type="text" placeholder="Years (eg. 2026 - Present)" value={job.year || ""} onChange={(e) => updateArrayField("experience", i, "year", e.target.value)} />
                            <input type="text" placeholder="Location" value={job.location || ""} onChange={(e) => updateArrayField("experience", i, "location", e.target.value)} />
                        </div>
                        <input type="text" placeholder="Description (use new lines for bullet points)" value={job.description?.join('\n') || ""} onChange={(e) => handleDescriptionChange("experience", i, e.target.value)} />
                        <button className="remove-btn" onClick={() => removeItem("experience", i)}>Remove</button>
                    </div>
                ))}
                <button className="add-btn" onClick={() => addItem("experience", { role: "", company: "", location: "", year: "", description: [] })}>+ Add Work Experience</button>
            </SectionCard>

            {/* Education */}
            <SectionCard title={"Education"}>
                {resumeData.education?.map((edu, i) => (
                    <div key={i} className="editor-nested-card">
                        <input type="text" placeholder="Name of Institute" value={edu.institute || ""} onChange={(e) => updateArrayField("education", i, "institute", e.target.value)} />
                        <input type="text" placeholder="Degree" value={edu.degree || ""} onChange={(e) => updateArrayField("education", i, "degree", e.target.value)} />
                        <div className="input-grid">
                            <input type="text" placeholder="Location" value={edu.location || ""} onChange={(e) => updateArrayField("education", i, "location", e.target.value)} />
                            <input type="text" placeholder="Graduation Year" value={edu.year || ""} onChange={(e) => updateArrayField("education", i, "year", e.target.value)} />
                            <input type="text" placeholder="GPA" value={edu.gpa || ""} onChange={(e) => updateArrayField("education", i, "gpa", e.target.value)} />
                        </div>
                        <button className="remove-btn" onClick={() => removeItem("education", i)}>Remove</button>
                    </div>
                ))}
                <button className="add-btn" onClick={() => addItem("education", { institute: "", degree: "", location: "", year: "", gpa: "" })}>+ Add Education</button>
            </SectionCard>

            {/* Skills */}
            <SectionCard title={"Skills"}>
                <textarea
                    placeholder="Enter skills separated by commas (e.g. React, Node.js, Python)" value={resumeData.skills?.join(', ') || ""} onChange={(e) => handleCSVChange("skills", e.target.value)} />
            </SectionCard>

            {/* Projects */}
            <SectionCard title={"Projects"}>
                {resumeData.projects?.map((proj, i) => (
                    <div key={i} className="editor-nested-card">
                        <input type="text" placeholder="Project Name" value={proj.name || ""} onChange={(e) => updateArrayField("projects", i, "name", e.target.value)} />
                        <input type="text" placeholder="Year" value={proj.year || ""} onChange={(e) => updateArrayField("projects", i, "year", e.target.value)} />
                        <textarea placeholder="Short Description" value={proj.description || ""} onChange={(e) => updateArrayField("projects", i, "description", e.target.value)} />
                        <input type="text" placeholder="Tech Stack (comma separated)" value={proj.tech?.join(', ') || ""} onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[i].tech = e.target.value.split(',').map(t => t.trim());
                            setResumeData({ ...resumeData, projects: updated });
                        }} />
                        <button className="remove-btn" onClick={() => removeItem("projects", i)}>Remove</button>
                    </div>
                ))}
                <button className="add-btn" onClick={() => addItem("projects", { name: "", year: "", description: "", tech: [] })}>+ Add Project</button>
            </SectionCard>

            {/* General logic to add/remove a new section */}
            {resumeData.customSections?.map((sec, secIndex) => (
                <SectionCard key={secIndex} title={sec.title || "New Section"}>
                    <input placeholder="Section Title" value={sec.title} onChange={(e) => updateArrayField("customSections", secIndex, "title", e.target.value)}></input>
                    {sec.items.map((item, itemIndex) => (
                        <textarea key={itemIndex} placeholder="Enter details" value={item} onChange={(e) => {
                            const updated = [...resumeData.customSections];
                            updated[secIndex].items[itemIndex] = e.target.value;
                            setResumeData({ ...resumeData, customSections: updated });
                        }} />
                    ))}
                    <button className="remove-btn" onClick={() => removeCustomSection(secIndex)}>Remove</button>
                </SectionCard>
            ))}
        </section>
    )
}

export default EditorPanel;