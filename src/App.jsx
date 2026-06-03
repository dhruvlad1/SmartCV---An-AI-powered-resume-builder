import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./pages/dashboard/Navbar";
import Login from "./pages/login";
import Register from "./pages/Register";
import ProjectChoice from "./pages/ProjectChoice/ProjectChoice";
import TemplateSelect from "./pages/TemplateSelect/TemplateSelect";
import Dashboard from "./pages/dashboard/Dashboard";
import { ResumeProvider } from "./pages/componenets/ResumeContext";
import { AuthProvider } from "./context/AuthContext";
import Editor from "./pages/Editor";

import "./styles/shared/app.css";

function AppContent() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isBuilderPage = location.pathname.startsWith("/builder/");
  const hideNavbar = isAuthPage || isBuilderPage;

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
      {!hideNavbar && <Navbar />}

      <main className={!hideNavbar ? "app-main with-navbar" : "app-main"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
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
      {/* AuthProvider wraps everything so user state is globally available */}
      <AuthProvider>
        <ResumeProvider>
          <AppContent />
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
