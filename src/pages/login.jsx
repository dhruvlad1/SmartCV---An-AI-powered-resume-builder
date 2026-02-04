// importing useState because js does not able to update 
// variable or changes on screen as for html its a dead 
// text so react have triggering thing for this by count,
// setCount for every changes

// we import link because with a whenevr we click new page 
// on website it would again refresh the whole website 
// losing all pre saved details and react router of link 
// solves that making ultra reach user experience

import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  // creating a memory in space with empty initial value with on lhs array destructing 
  // where formData holds current value and setFormData allows us to change values in formData
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // on handling change of event when someone write text in email or password the spread operator saves old data and what we are changing 
  // email or password keeps the other thing same like if someone changes his email the old password be still intact

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Logic Here", formData);
  };
//handles refreshing on submit button so that our details filled would remain intach and would not go away after refreshing every time
  return (
    <div className="page-wrapper">
      
      


      <div className="auth-container">
         <div className="logo">
          Smart<span className="logo-highlight">CV</span>
        </div>
        <h2>Welcome Back</h2>
        <p className="subtitle">Your dream job is just one resume away.</p>
        
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>

        <p style={{ marginTop: '1.5rem', color: '#94A3B8' }}>
          New user? <Link to="/register" style={{ color: '#06B6D4' }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;