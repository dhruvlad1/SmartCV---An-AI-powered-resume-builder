import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectChoice from "./pages/ProjectChoice";
import TemplateSelect from "./pages/TemplateSelect";
import Dashboard from "./pages/dashboard/Dashboard";

import "./styles/workspace.css";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <></>}
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        {/* Resume builder flow */}
        <Route path="/project-choice" element={<ProjectChoice />} />
        <Route path="/templates/:resumeId" element={<TemplateSelect />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
// comment for testing
export default App;
