import React, { useState } from "react";
import "../../App.css";
import List from "./List";
import CreateResumeBtn from "./CreateResumeBtn";
import { Search, Sparkles, Layout, Zap, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./dashboard.css";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, authLoading } = useAuth();

  // While we're checking auth status, show nothing (avoids flicker)
  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <Loader2 size={40} className="spin-icon" />
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">

      {/* ══════════════════════════════════════════
          HERO SECTION — visible to everyone
      ══════════════════════════════════════════ */}
      <section className="dashboard-hero">
        <div className="hero-bg">
          <div className="hero-orb orb-a"></div>
          <div className="hero-orb orb-b"></div>
          <div className="hero-grid-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>AI-Powered Resume Builder</span>
          </div>

          <h1 className="hero-title">
            Build your professional<br />
            <span className="hero-gradient-text">resume in minutes</span>
          </h1>

          <p className="hero-subtitle">
            Stand out with ATS-friendly templates, AI-assisted content, and stunning designs — all in one place.
          </p>

          <div className="hero-cta">
            <CreateResumeBtn />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DOCUMENTS SECTION — only if logged in
      ══════════════════════════════════════════ */}
      {user && (
        <section className="docs-section">
          <div className="docs-container">
            <div className="docs-section-header">
              <h2 className="docs-title">Your Resumes</h2>
              <div className="search-container">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  placeholder="Search resumes..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <List searchQuery={searchQuery} />
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          FEATURES — shown to guests to entice signup
      ══════════════════════════════════════════ */}
      {!user && (
        <section className="features-section">
          <div className="features-container">
            <h2 className="features-heading">Everything you need</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon blue"><Layout size={22} /></div>
                <h3>Pro Templates</h3>
                <p>ATS-optimized designs crafted for modern job markets.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon purple"><Zap size={22} /></div>
                <h3>AI Assistant</h3>
                <p>Generate impactful bullet points and summaries instantly.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon gold"><CheckCircle size={22} /></div>
                <h3>ATS Score</h3>
                <p>Real-time feedback to make sure your resume passes filters.</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
