import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./pages/dashboard/Navbar";
import Login from "./pages/login";
import Register from "./pages/Register";
import ProjectChoice from "./pages/ProjectChoice";
import TemplateSelect from "./pages/TemplateSelect";
import Dashboard from "./pages/dashboard/Dashboard";
import Editor from "./pages/Editor";

import "./styles/workspace.css";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Add/remove auth-page class to body for centering auth pages
  useEffect(() => {
    if (isAuthPage) {
      document.body.classList.add('auth-page');
    } else {
      document.body.classList.remove('auth-page');
    }
  }, [isAuthPage]);

  return (
    <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', minHeight: '100vh' }}>
      {!isAuthPage && <Navbar />}
      <main className={!isAuthPage ? "app-main with-navbar" : "app-main"}>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        {/* Resume builder flow */}
        <Route path="/project-choice" element={<ProjectChoice />} />
        <Route path="/templates/:resumeId" element={<TemplateSelect />} />
        <Route path="/builder/:resumeId" element={<Editor />} />
      </Routes>
      </main>
    </div>
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
