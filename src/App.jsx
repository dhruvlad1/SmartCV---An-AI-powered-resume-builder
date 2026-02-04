import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectChoice from "./pages/ProjectChoice";
import TemplateSelect from "./pages/TemplateSelect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Temporary default route */}
        <Route path="/" element={<ProjectChoice />} />

        {/* Template selection */}
        <Route path="/templates/:resumeId" element={<TemplateSelect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
