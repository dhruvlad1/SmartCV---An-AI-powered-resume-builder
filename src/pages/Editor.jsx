import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./componenets/Sidebar";
import EditorPanel from "./componenets/EditorPanel";
import PreviewPanel from "./componenets/PreviewPanel";
import ATSChecker from "./componenets/ATSChecker";
import "../App.css";
import "./componenets/Editor.css";
import { useResume } from "./componenets/ResumeContext";
import { updateResume, getResumeById } from "../services/resumeService";
import { Link } from "react-router-dom";

const Editor = () => {
  const { resumeId } = useParams();
  const { resumeData, setResumeData } = useResume();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isATSOpen, setIsATSOpen] = useState(false);

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

  // Save resume to DB
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

  // Add custom section
  const addCustomSection = () => {
    setResumeData((prev) => ({
      ...prev,
      customSections: [
        ...(prev.customSections || []),
        { title: "", items: [""] },
      ],
    }));
  };

  // Toggle ATS Panel
  const toggleATS = () => {
    setIsATSOpen((prev) => !prev);
  };

  if (loading)
    return <div className="loading-screen">Loading Workspace...</div>;

  return (
    <div className="editor-page-wrapper">

      {/* TOOLBAR */}
       <div className="editor-toolbar">
  {/* LEFT SIDE */}
  <div className="toolbar-left">
     <Link to="/" className="navbar-brand">
      Smart<span>CV</span>
      </Link>
  

   


  </div>

  {/* RIGHT SIDE */}
  <div className="toolbar-right">
    <button
      className="save-btn primary"
      onClick={handleSave}
      disabled={saving}
    >
      {saving ? "Saving..." : "Save Changes"}
    </button>
  </div>
</div>

        
        

      <div className="editor-container">
        <Sidebar onATSToggle={toggleATS} isATSOpen={isATSOpen} />

        <main className="main-layout">

          {/* ATS PANEL */}
          {isATSOpen && (
            <ATSChecker
              resumeData={resumeData}
              onClose={() => setIsATSOpen(false)}
            />
          )}

          <EditorPanel
            resumeId={resumeId}
            resumeData={resumeData}
            setResumeData={setResumeData}
            addCustomSection={addCustomSection}
          />

          <PreviewPanel
            resumeData={resumeData}
            previewRef={previewRef}
          />
        </main>
      </div>
    </div>
  );
};

export default Editor;