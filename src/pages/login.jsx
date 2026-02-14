import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true },
      );

      // DEBUG: Let's see exactly what the server sent
      console.log("Full Server Response:", response.data);

      // Check for 'token' or 'accessToken' or whatever the backend uses
      const token = response.data.token || response.data.accessToken;

      if (token) {
        localStorage.setItem("token", token);
        console.log("Token saved to storage!");

        // Short delay to ensure browser writes to storage before navigating
        setTimeout(() => {
          navigate("/");
        }, 100);
      } else {
        console.warn(
          "Login successful, but NO TOKEN was found in response.data",
        );
        alert("Login error: No token received from server.");
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error("Axios Login Error:", error);
      const message =
        error.response?.data?.error || "Invalid Email or Password";
      alert(message);
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

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Signing In..." : "Login"}
          </button>
        </form>

        <p className="footer-text">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;