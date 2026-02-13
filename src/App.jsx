import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./pages/dashboard/Navbar";
import Login from "./pages/login";
import Register from "./pages/Register";
import ProjectChoice from "./pages/ProjectChoice/ProjectChoice";
import TemplateSelect from "./pages/TemplateSelect/TemplateSelect";
import Dashboard from "./pages/dashboard/Dashboard";
import { ResumeProvider } from "./pages/componenets/ResumeContext";
import Editor from "./pages/Editor";

import "./styles/shared/app.css";

function AppContent() {
  const location = useLocation();

  // 1. Define pages where the standard Navbar should NOT appear
  // Usually, we hide it on Login, Register, AND the actual Editor (Builder)
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isBuilderPage = location.pathname.startsWith("/builder/");

  const hideNavbar = isAuthPage || isBuilderPage;

  // Add/remove auth-page class to body for centering auth pages
  useEffect(() => {
    if (isAuthPage) {
      document.body.classList.add("auth-page");
    } else {
      document.body.classList.remove("auth-page");
    }
  }, [isAuthPage]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      {/* 2. Conditionally render Navbar */}
      {!hideNavbar && <Navbar />}

      <main className={!hideNavbar ? "app-main with-navbar" : "app-main"}>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Resume builder flow */}
          <Route path="/project-choice" element={<ProjectChoice />} />

          {/* Use :resumeId to match the useParams() we set up in Editor.jsx */}
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
      <ResumeProvider>
        <AppContent />
      </ResumeProvider>
    </BrowserRouter>
  );
}

export default App;
