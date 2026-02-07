import JakesClassic from "./layouts/JakesClassic";
import Modern from "./layouts/Modern";
import Minimal from "./layouts/Minimal";

export default function ResumePreview({ template, data }) {
  // No template selected yet
  if (!template) {
    return (
      <div style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
        <p>Select a template to see a preview</p>
      </div>
    );
  }

  const ResumeContent = data || {};

  // Decide which layout to render
  switch (template) {
    case "jakes-classic":
      return <JakesClassic data={ResumeContent} />;

    case "modern":
      return <Modern data={ResumeContent} />;

    case "minimal":
      return <Minimal data={ResumeContent} />;

    default:
      return (
        <div>
          <p>Template "{template}" not supported</p>
        </div>
      );
  }
}