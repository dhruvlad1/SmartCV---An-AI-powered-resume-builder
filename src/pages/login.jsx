import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE_URL = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    setIsLoggingIn(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );

      const token = response.data.token || response.data.accessToken;

      if (token) {
        // This sets the token AND immediately re-fetches /auth/me
        // so Navbar + Dashboard update without any hard reload
        await login(token);
        navigate("/");
      } else {
        setError("Login error: No token received from server.");
        setIsLoggingIn(false);
      }
    } catch (err) {
      const message = err.response?.data?.error || "Invalid Email or Password";
      setError(message);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="auth-container">
        <div className="logo">
          Smart<span className="logo-highlight">CV</span>
        </div>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to continue building your resume</p>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ color: "#94A3B8", fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoggingIn}
            required
            autoComplete="email"
          />

          <label style={{ color: "#94A3B8", fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>
            Password
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoggingIn}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={isLoggingIn} style={{ marginTop: "1.5rem" }}>
            {isLoggingIn ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <Loader2 size={18} className="animate-spin" />
                Signing In...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="footer-text" style={{ textAlign: "center", marginTop: "1.5rem" }}>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;