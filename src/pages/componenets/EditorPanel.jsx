// Main Panel containing collapsible section cards
// User enters information in each card

import SectionCard from "./SectionCard";
import "./Editor.css";
import "../App.css";

// Panel receives: resumeData -> current state, setResumeData -> function to update state

const EditorPanel = ({ resumeData = {}, setResumeData, addCustomSection }) => {

    // Generic handler to update any field (eg - name, email, etc.)

    const updateArrayField = (section, index, field, value) => {
        const updated = [...resumeData[section]];
        updated[index][field] = value;
        setResumeData({ ...resumeData, [section]: updated });
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

    return (
        <section className="editor-panel">
            <div className="panel-title">
                <h2>Edit Resume</h2>
                <button onClick={addCustomSection}>Add Section</button>
            </div>

            {/* Personal Info */}
            <SectionCard title={'Personal Information'}>
                {/*resumeData.name || "" -> If name is entered, resumeData.name will be visible, else blank */}
                <input type="text" placeholder="Full Name" value={resumeData.name || ""} onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })} />
                <input type="text" placeholder="Email address" value={resumeData.email || ""} onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })} />
                <input type="text" placeholder="Phone Number" value={resumeData.phone || ""} onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })} />
                <input type="text" placeholder="City, Country" value={resumeData.location || ""} onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })} />
            </SectionCard>

            {/* Professional Summary */}
            <SectionCard title={"Professional Summary"}>
                <textarea placeholder="Write a short professional summary..." value={resumeData.summary || ""} onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })} />
            </SectionCard>

            {/* Work info */}
            <SectionCard title={"Work Experience"}>
                {resumeData.work.map((job, i) => (
                    <div key={i} className="editor-nested-card">
                        <input type="text" placeholder="Job Title" value={job.jobTitle || ""} onChange={(e) => updateArrayField("work", i, "jobTitle", e.target.value)} />
                        <input type="text" placeholder="Company" value={job.company || ""} onChange={(e) => updateArrayField("work", i, "company", e.target.value)} />
                        <input type="text" placeholder="Description" value={job.workDesc || ""} onChange={(e) => updateArrayField("work", i, "workDesc", e.target.value)} />
                        <button className="remove-btn" onClick={() => removeItem("work", i)}>Remove</button>
                    </div>
                ))}
                <button className="add-btn" onClick={() => addItem("work", { jobTitle: "", company: "", workDesc: "" })}>+ Add Work Experience</button>
            </SectionCard>

            {/* Education */}
            <SectionCard title={"Education"}>
                {resumeData.education.map((edu, i) => (
                    <div key={i} className="editor-nested-card">
                        <input type="text" placeholder="Name of Institute" value={edu.institute || ""} onChange={(e) => updateArrayField("education", i, "institute", e.target.value)} />
                        <input type="text" placeholder="Degree" value={edu.degree || ""} onChange={(e) => updateArrayField("education", i, "degree", e.target.value)} />
                        <input type="text" placeholder="Other Details" value={edu.details || ""} onChange={(e) => updateArrayField("education", i, "details", e.target.value)} />
                        <button className="remove-btn" onClick={() => removeItem("education", i)}>Remove</button>
                    </div>
                ))}
                <button className="add-btn" onClick={() => addItem("education", { institute: "", degree: "", details: "" })}>+ Add Education</button>
            </SectionCard>

            {/* Projects */}
            <SectionCard title={"Projects"}>
                {resumeData.projects.map((proj, i) => (
                    <div key={i} className="editor-nested-card">
                        <input type="text" placeholder="Project" value={proj.project || ""} onChange={(e) => updateArrayField("projects", i, "project", e.target.value)} />
                        <input type="text" placeholder="Description" value={proj.projectDesc || ""} onChange={(e) => updateArrayField("projects", i, "projectDesc", e.target.value)} />
                        <button className="remove-btn" onClick={() => removeItem("projects", i)}>Remove</button>
                    </div>
                ))}
                <button className="add-btn" onClick={() => addItem("projects", { project: "", projectDesc: "" })}>+ Add Project</button>
            </SectionCard>

            {/* General logic to add a new section */}
            {resumeData.customSections.map((sec, secIndex) => (
                <SectionCard key={secIndex} title={sec.title || "New Section"}>
                    <input placeholder="Section Title" value={sec.title} onChange={(e) => updateArrayField("customSections", secIndex, "title", e.target.value)}></input>
                    {sec.items.map((item, itemIndex) => (
                        <textarea key={itemIndex} placeholder="Enter details" value={item} onChange={(e) => {
                            const updated = [...resumeData.customSections];
                            updated[secIndex].items[itemIndex] = e.target.value;
                            setResumeData({ ...resumeData, customSections: updated });
                        }} />
                    ))}
                </SectionCard>
            ))}
        </section>
    )
}

export default EditorPanel;