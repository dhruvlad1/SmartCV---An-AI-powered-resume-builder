import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Register from "./pages/Register";
import ProjectChoice from "./pages/ProjectChoice";
import TemplateSelect from "./pages/TemplateSelect";

import "./styles/workspace.css";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Resume builder flow */}
        <Route path="/" element={<ProjectChoice />} />
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

export default App;
