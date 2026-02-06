// Main parent component for editor
// Holds all resume data and passes it to child components
// Editor page contains a sidebar, editor panel and live preview

import { useRef, useState } from "react";
import Sidebar from "./componenets/Sidebar";
import EditorPanel from "./componenets/EditorPanel";
import PreviewPanel from "./componenets/PreviewPanel";
import "./App.css";
import "./components/Editor.css";

const Editor = () => {

    // resumeData = Resume data (Initially empty)
    // setResumeData = function for adding data
    const [resumeData, setResumeData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
        work: [{
            jobTitle: "",
            company: "",
            workDesc: "",
        }],
        education: [{
            institute: "",
            degree: "",
            details: "",
        }],
        projects: [{
            project: "",
            projectDesc: "",
        }],
        customSections: []
    });

    const previewRef = useRef();

    // Adding a custom section in Editor Panel
    const addCustomSection = () => {
        setResumeData(prev => (
            { ...prev, customSections: [...prev.customSections, { title: "", items: [""] }] }
        ));
    }

    return (
        <div className="page-wrapper">
            <div className="editor-container">
                <Sidebar></Sidebar>
                <main className="main-layout">
                    {/* Panel receives: resumeData -> current state, setResumeData -> function to update state, addCustomSection -> function to add a new section */}
                    <EditorPanel resumeData={resumeData} setResumeData={setResumeData} addCustomSection={addCustomSection}></EditorPanel>
                    <PreviewPanel resumeData={resumeData} previewRef={previewRef}></PreviewPanel>
                </main>
            </div>
        </div>
    )
}

export default Editor;