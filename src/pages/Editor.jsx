import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./componenets/Sidebar";
import EditorPanel from "./componenets/EditorPanel";
import PreviewPanel from "./componenets/PreviewPanel";
import "../App.css";
import "./componenets/Editor.css";
import { useResume } from "./componenets/ResumeContext";
// FIXED: Import path corrected (pages to services is one step up)
import { updateResume, getResumeById } from "../services/resumeService";

const Editor = () => {
  const { resumeId } = useParams();
  const { resumeData, setResumeData } = useResume();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const previewRef = useRef();

  // Load resume data from MongoDB Atlas on mount
  useEffect(() => {
    const loadResume = async () => {
      try {
        const data = await getResumeById(resumeId);
        if (data) {
          setResumeData(data);
        }
      } catch (err) {
        console.error("Error loading resume:", err);
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) loadResume();
  }, [resumeId, setResumeData]);

  // Push the current state to the database
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateResume(resumeId, resumeData);
      alert("Changes saved to Database!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Check your backend connection.");
    } finally {
      setSaving(false);
    }
  };

  const addCustomSection = () => {
    setResumeData((prev) => ({
      ...prev,
      customSections: [
        ...(prev.customSections || []),
        { title: "", items: [""] },
      ],
    }));
  };

  if (loading)
    return <div className="loading-screen">Loading Workspace...</div>;

  return (
    <div className="editor-page-wrapper">
      {/* TOOLBAR */}
      <div className="editor-toolbar">
        <div className="toolbar-info">
          <span>
            Editing: <strong>{resumeData.title || "Untitled"}</strong>
          </span>
        </div>
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="editor-container">
        <Sidebar />
        <main className="main-layout">
          <EditorPanel
            resumeId={resumeId}
            resumeData={resumeData}
            setResumeData={setResumeData}
            addCustomSection={addCustomSection}
          />
          <PreviewPanel resumeData={resumeData} previewRef={previewRef} />
        </main>
      </div>
    </div>
  );
};

export default Editor;
