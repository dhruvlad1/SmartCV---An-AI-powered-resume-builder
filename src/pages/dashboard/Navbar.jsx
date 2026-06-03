import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./dashboard.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ← single source of truth
  const [scrolled, setScrolled] = useState(false);

  // Scroll-based frosted glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout(); // clears token + resets global user to null
    navigate("/login");
  };

  const displayName = user?.username || (user?.email ? user.email.split("@")[0] : "");
  const initial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <nav className={`navbarDashboard ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-containerDashboard">
        {/* Logo */}
        <div
          className="logoDashboard"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Smart<span>CV</span>
        </div>

        {/* Right side — reactively switches between user info and Sign In */}
        <div className="nav-actions">
          {user ? (
            // ── Logged-in state ──
            <div className="user-profile-wrapper">
              <div className="user-profile-nav">
                <span className="user-name-label">{displayName}</span>
                <div className="profile-circle-container" title={user.email}>
                  <span className="profile-initial">{initial}</span>
                </div>
              </div>

              {/* Hover dropdown */}
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <User size={14} />
                  <span>{user.email}</span>
                </div>
                <div className="dropdown-divider-line"></div>
                <div className="dropdown-item logout-item" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          ) : (
            // ── Guest state ──
            <button className="login-btn" onClick={() => navigate("/login")}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
