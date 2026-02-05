import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import '../App.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  // 1. Add a Loading State
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true); // Lock the buttons
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // No alert needed, just go
      navigate('/dashboard'); 
    } catch (error) {
      alert("Invalid Email or Password");
      setIsLoggingIn(false); // Unlock if it fails
    }
  };

 const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      // If user closes the popup, just ignore it.
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error(error);
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="auth-container">
        <div className="logo">Smart<span className="logo-highlight">CV</span></div>
        <h2>Welcome Back</h2>
        
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          
          {/* 3. Show "Logging in..." while waiting */}
          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="divider">OR LOGIN WITH</div>
        
        <div className="social-login">
          {/* 4. Disable this button too */}
          <button 
            type="button" 
            className="social-btn" 
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            style={{ opacity: isLoggingIn ? 0.5 : 1 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.81H12V14.41H18.45C18.18 15.89 17.34 17.15 16.08 17.98V20.97H19.95C22.21 18.89 23.52 15.83 23.52 12.29Z" fill="#4285F4"/>
              <path d="M12 24C15.24 24 17.95 22.92 19.95 21.08L16.08 17.99C15 18.72 13.62 19.14 12 19.14C8.87 19.14 6.22 17.03 5.27 14.19H1.27V17.29C3.25 21.22 7.32 24 12 24Z" fill="#34A853"/>
              <path d="M5.27 14.19C5.03 13.31 4.9 12.4 4.9 11.47C4.9 10.54 5.03 9.63 5.27 8.75V5.65H1.27C0.46 7.27 0 9.1 0 11.47C0 13.84 0.46 15.67 1.27 17.29L5.27 14.19Z" fill="#FBBC05"/>
              <path d="M12 3.8C13.76 3.8 15.34 4.41 16.59 5.59L19.99 2.19C17.95 0.29 15.24 0 12 0C7.32 0 3.25 2.78 1.27 6.71L5.27 9.81C6.22 6.97 8.87 3.8 12 3.8Z" fill="#EA4335"/>
            </svg>
            {isLoggingIn ? "Wait..." : "Google"}
          </button>
        </div>

        <p className="footer-text">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;