import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut } from "lucide-react";
import "./dashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true,
        });
        if (isMounted) {
          setUser(res.data);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className="navbarDashboard">
      <div className="nav-containerDashboard">
        <div
          className="logoDashboard"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Smart<span>CV</span>
        </div>

        <div className="nav-actions">
          {user ? (
            <div className="user-profile-wrapper">
              <div className="user-profile-nav">
                <span className="user-name-label">
                  {user.username ||
                    (user.email ? user.email.split("@")[0] : "User")}
                </span>
                <div className="profile-circle-container">
                  <span className="profile-initial">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
