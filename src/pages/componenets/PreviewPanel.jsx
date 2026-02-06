// Live preview of information typed in Editor panel
// Also has an option for downloading resume as a pdf

// For downloading resume as pdf
import html2canvas from "html2canvas";
import jsPDF from "jspdf"

const PreviewPanel = ({ resumeData, previewRef }) => {

    // Downloading resume as pdf
    // Async needed because html2canvas takes time to capture the screen
    const downloadPDF = async () => {
        // Taking the element(resume)
        const element = previewRef.current;
        // Render element as canvas image
        const canvas = await html2canvas(element, { scale: 2 });
        // Convert to image and insert image into pdf
        const imgData = canvas.toDataURL("image.png");
        // create pdf with dimensions
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let leftHeight = imgHeight;
        let position = 0;
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        while (leftHeight > 0) { //Add extra pages in pdf if needed
            position = leftHeight - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
        }
        // Save pdf (triggers download)
        pdf.save("resume.pdf");
    }

    return (
        <section className="preview-panel">
            <div className="panel-title">
                <h2>Live Preview</h2>
                {/* Download btn */}
                <button onClick={downloadPDF}>
                    Download PDF
                </button>
            </div>

            {/* Live Preview */}
            <div className="resume-preview" ref={previewRef}>
                <h1>{resumeData.name || "[Full Name]"}</h1>
                <p>{resumeData.email || "Email"} | {resumeData.phone || "Phone"} | {resumeData.location || "City, Country"}</p>
                <hr />
                <h3>Professional Summary</h3>
                <p>{resumeData.summary || "Short Professional summary"}</p>
                <hr />
                <h3>Work Experience</h3>
                {resumeData.work.map((job, i) => (
                    <div key={i}>
                        <strong>{job.jobTitle || "Job Title"} - {job.company || "Company"}</strong>
                        <p>{job.workDesc || "Description"}</p>
                    </div>
                ))}
                <hr />
                <h3>Education</h3>
                {resumeData.education.map((edu, i) => (
                    <div key={i}>
                        <strong>{edu.institute || "Institute Name"}</strong>
                        <p>Degree: {edu.degree || "Degree"}</p>
                        <p>{edu.details || ""}</p>
                    </div>
                ))}
                <hr />
                <h3>Projects</h3>
                {resumeData.projects.map((proj, i) => (
                    <div key={i}>
                        <strong>{proj.project || "Project Name"}</strong>
                        <p>{proj.projectDesc || "Project Description"}</p>
                    </div>
                ))}
                {/* All custom sections added from Editor Panel */}
                {resumeData.customSections.length > 0 && (
                    <>
                        {resumeData.customSections.map((sec, i) => (
                            <div key={i}>
                                <h3>{sec.title || "New Section"}</h3>
                                {sec.items.map((item, j) => (
                                    <p key={j}>{item || "Detail"}</p>
                                ))}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default PreviewPanel;