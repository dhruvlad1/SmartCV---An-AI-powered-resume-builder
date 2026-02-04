import { previewResume } from "../../data/temp";
import JakesClassic from "./layouts/JakesClassic";

export default function ResumePreview({ template }) {
  if (!template) {
    return <p>Select a template to preview</p>;
  }

  switch (template) {
    case "jakes-classic":
      return <JakesClassic data={previewResume} />;

    default:
      return <p>Template not implemented</p>;
  }
}
