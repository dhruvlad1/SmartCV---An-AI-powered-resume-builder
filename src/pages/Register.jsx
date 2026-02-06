import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering User:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="auth-container">
           <div className="logo">
          Smart<span className="logo-highlight">CV</span>
        </div>
        <h2>Create Account</h2>
        <p className="subtitle">Start building your AI Resume</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
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
          
          <button type="submit">Sign Up</button>
        </form>
        <div className="divider">OR SIGN UP WITH</div>

 
        <div className="social-login">
          <button type="button" className="social-btn">
           {/* here svg is tool of code that makes the shape and colour combination of logo of gold with four different path constituting the google logo */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.81H12V14.41H18.45C18.18 15.89 17.34 17.15 16.08 17.98V20.97H19.95C22.21 18.89 23.52 15.83 23.52 12.29Z" fill="#4285F4"/>
              <path d="M12 24C15.24 24 17.95 22.92 19.95 21.08L16.08 17.99C15 18.72 13.62 19.14 12 19.14C8.87 19.14 6.22 17.03 5.27 14.19H1.27V17.29C3.25 21.22 7.32 24 12 24Z" fill="#34A853"/>
              <path d="M5.27 14.19C5.03 13.31 4.9 12.4 4.9 11.47C4.9 10.54 5.03 9.63 5.27 8.75V5.65H1.27C0.46 7.27 0 9.1 0 11.47C0 13.84 0.46 15.67 1.27 17.29L5.27 14.19Z" fill="#FBBC05"/>
              <path d="M12 3.8C13.76 3.8 15.34 4.41 16.59 5.59L19.99 2.19C17.95 0.29 15.24 0 12 0C7.32 0 3.25 2.78 1.27 6.71L5.27 9.81C6.22 6.97 8.87 3.8 12 3.8Z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          
          <button type="button" className="social-btn">

            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Phone
          </button>
        </div>
        <p className="footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;