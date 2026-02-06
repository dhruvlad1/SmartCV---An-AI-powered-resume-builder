import { previewResume } from "../../data/temp";

import JakesClassic from "./layouts/JakesClassic";
import Modern from "./layouts/Modern";
import Minimal from "./layouts/Minimal";

export default function ResumePreview({ template }) {
  // No template selected yet
  if (!template) {
    return (
      <div style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
        <p>Select a template to see a preview</p>
      </div>
    );
  }

  // Decide which layout to render
  switch (template) {
    case "jakes-classic":
      return <JakesClassic data={previewResume} />;

    case "modern":
      return <Modern data={previewResume} />;

    case "minimal":
      return <Minimal data={previewResume} />;

    default:
      return (
        <div>
          <p>Template not supported</p>
        </div>
      );
  }
}