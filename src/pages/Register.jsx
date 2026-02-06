import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../firebase'; 
import { createUserWithEmailAndPassword, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import '../App.css';

const Register = () => {
  
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });

  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  
 
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        createdAt: new Date(),
        uid: user.uid,
        role: "user"
      });

      alert("Account Created Successfully!");
      navigate('/login');

    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

 
  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          fullName: user.displayName,
          email: user.email,
          createdAt: new Date(),
          uid: user.uid,
          role: "user"
        });
      }
      navigate('/login');

    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        alert(error.message);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };


  const setupRecaptcha = () => {
   
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (error) {
        console.warn("Could not clear recaptcha", error);
      }
      window.recaptchaVerifier = null;
    }

   
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => console.log("Recaptcha Verified")
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsPhoneLoading(true);
    
    // 1. Setup ReCaptcha
    setupRecaptcha();
    
    const appVerifier = window.recaptchaVerifier;
    const formattedNumber = "+91" + phoneNumber;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      setVerificationId(confirmationResult);
      alert("OTP Sent to " + formattedNumber);
    } catch (err) {
      console.error(err);
      alert(err.message);
   
      setIsPhoneLoading(false);
    } finally {
   
       setIsPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsPhoneLoading(true);

    try {
      const result = await verificationId.confirm(otp);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          fullName: "Phone User",
          phoneNumber: user.phoneNumber,
          createdAt: new Date(),
          uid: user.uid,
          role: "user"
        });
      }
      
      alert("Phone Registration Successful!");
      navigate('/dashboard'); 
    } catch (err) {
      console.error(err);
      alert("Invalid Code");
    } finally {
      setIsPhoneLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="auth-container">
        <div className="logo">
          Smart<span className="logo-highlight">CV</span>
        </div>
        <h2>{isPhoneMode ? "Register with Phone" : "Create Account"}</h2>
        <p className="subtitle">Start building your AI Resume</p>
     
        <div id="recaptcha-container"></div>

        {!isPhoneMode ? (
        
          <>
            <form onSubmit={handleSubmit}>
              <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
              <button type="submit">Sign Up</button>
            </form>

            <div className="divider">OR SIGN UP WITH</div>

            <div className="social-login">
              <button type="button" className="social-btn" onClick={handleGoogleSignIn}>
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.81H12V14.41H18.45C18.18 15.89 17.34 17.15 16.08 17.98V20.97H19.95C22.21 18.89 23.52 15.83 23.52 12.29Z" fill="#4285F4"/><path d="M12 24C15.24 24 17.95 22.92 19.95 21.08L16.08 17.99C15 18.72 13.62 19.14 12 19.14C8.87 19.14 6.22 17.03 5.27 14.19H1.27V17.29C3.25 21.22 7.32 24 12 24Z" fill="#34A853"/><path d="M5.27 14.19C5.03 13.31 4.9 12.4 4.9 11.47C4.9 10.54 5.03 9.63 5.27 8.75V5.65H1.27C0.46 7.27 0 9.1 0 11.47C0 13.84 0.46 15.67 1.27 17.29L5.27 14.19Z" fill="#FBBC05"/><path d="M12 3.8C13.76 3.8 15.34 4.41 16.59 5.59L19.99 2.19C17.95 0.29 15.24 0 12 0C7.32 0 3.25 2.78 1.27 6.71L5.27 9.81C6.22 6.97 8.87 3.8 12 3.8Z" fill="#EA4335"/></svg>
                 Google
              </button>
              
              <button type="button" className="social-btn" onClick={() => setIsPhoneMode(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Phone
              </button>
            </div>
          </>
        ) : (
          /* PHONE FORM */
          <div className="phone-form">
            {!verificationId ? (
              <form onSubmit={handleSendOtp}>
                <div className="input-with-prefix" style={{position: 'relative'}}>
                  <span style={{position: 'absolute', left: '15px', top: '14px', color: '#666', fontWeight: 'bold'}}>+91</span>
                  <input 
                    type="tel" 
                    placeholder="Enter 10-digit Number" 
                    value={phoneNumber} 
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === '' || re.test(e.target.value)) setPhoneNumber(e.target.value);
                    }}
                    maxLength="10"
                    style={{paddingLeft: '50px'}}
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isPhoneLoading}
                  style={{ opacity: isPhoneLoading ? 0.7 : 1 }}
                >
                  {isPhoneLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required 
                />
                <button 
                  type="submit" 
                  disabled={isPhoneLoading}
                  style={{ opacity: isPhoneLoading ? 0.7 : 1 }}
                >
                  {isPhoneLoading ? "Verifying..." : "Verify & Register"}
                </button>
              </form>
            )}
             <button 
               className="text-btn" 
               type="button"
               style={{marginTop: '10px', background: 'none', color: '#666', border: 'none', cursor: 'pointer', width: '100%'}}
               onClick={() => { setIsPhoneMode(false); setVerificationId(null); setPhoneNumber(''); }}
             >
               &larr; Back to Email Sign Up
             </button>
          </div>
        )}

        <p className="footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;