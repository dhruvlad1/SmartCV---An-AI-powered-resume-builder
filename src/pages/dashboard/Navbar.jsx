import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Import the hook
import "./dashboard.css";

const Navbar = () => {
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const handleLoginClick = () => {
    navigate("/login"); // 3. Set this to your actual login route path
  };

  return (
    <nav className="navbarDashboard">
      <div className="nav-containerDashboard">
        {/* Logo Section */}
        <div className="logoDashboard">
          Smart<span>CV</span>
        </div>

        {/* Right Side - Action Section */}
        <div className="nav-actions">
          <button className="login-btn" onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
