// Main parent component for editor
// Holds all resume data and passes it to child components
// Editor page contains a sidebar, editor panel and live preview

import { useRef, useState } from "react";
import Sidebar from "./componenets/Sidebar";
import EditorPanel from "./componenets/EditorPanel";
import PreviewPanel from "./componenets/PreviewPanel";
import "./App.css";
import "./Editor.css";

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
        }]
    });

    const previewRef = useRef();

    return (
        <div className="page-wrapper">
            <div className="editor-container">
                <Sidebar></Sidebar>
                <main className="main-layout">
                    {/* Panel receives: resumeData -> current state, setResumeData -> function to update state */}
                    <EditorPanel resumeData={resumeData} setResumeData={setResumeData}></EditorPanel>
                    <PreviewPanel resumeData={resumeData} previewRef={previewRef}></PreviewPanel>
                </main>
            </div>
        </div>
    )
}

export default Editor;