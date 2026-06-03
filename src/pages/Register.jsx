import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE_URL = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

const getPasswordStrength = (pass) => {
  if (!pass) return { score: 0, text: "", cls: "" };
  if (pass.length < 6) return { score: 1, text: "Weak", cls: "weak" };
  if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass))
    return { score: 3, text: "Strong", cls: "strong" };
  return { score: 2, text: "Medium", cls: "medium" };
};

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 1. Register the account
      await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        { username: formData.fullName, email: formData.email, password: formData.password },
        { withCredentials: true }
      );

      // 2. Auto-login after registration so user is immediately authenticated
      try {
        const loginRes = await axios.post(
          `${API_BASE_URL}/api/auth/login`,
          { email: formData.email, password: formData.password },
          { withCredentials: true }
        );
        const token = loginRes.data.token || loginRes.data.accessToken;
        if (token) {
          await login(token); // Updates global auth state
          navigate("/");     // Goes to dashboard already logged in
          return;
        }
      } catch {
        // If auto-login fails, fall back to login page
      }

      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      setError(message);
      setIsSubmitting(false);
    }
  };

  const strengthBarWidth = strength.score === 1 ? "33%" : strength.score === 2 ? "66%" : strength.score === 3 ? "100%" : "0%";
  const strengthColor = strength.cls === "weak" ? "#F43F5E" : strength.cls === "medium" ? "#F59E0B" : "#10B981";

  return (
    <div className="page-wrapper">
      <div className="auth-container">
        <div className="logo">
          Smart<span className="logo-highlight">CV</span>
        </div>
        <h2>Create Account</h2>
        <p className="subtitle">Start building your AI-powered resume today</p>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ color: "#94A3B8", fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />

          <label style={{ color: "#94A3B8", fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />

          <label style={{ color: "#94A3B8", fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password Strength Bar */}
          {formData.password && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: strengthBarWidth, background: strengthColor, borderRadius: "2px", transition: "width 0.4s ease, background 0.4s ease" }} />
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: strengthColor }}>{strength.text}</p>
            </div>
          )}

          <label style={{ color: "#94A3B8", fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
            <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)} tabIndex="-1">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={isSubmitting} style={{ marginTop: "1.5rem" }}>
            {isSubmitting ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <Loader2 size={18} className="animate-spin" />
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="footer-text" style={{ textAlign: "center", marginTop: "1.5rem" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;