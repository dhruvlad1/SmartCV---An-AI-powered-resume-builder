import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Mock user data - replace with actual auth state later
  const currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    initials: 'JD'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfile = () => {
    setIsDropdownOpen(false);
    // Navigate to profile page (to be implemented)
    console.log('Navigate to profile');
  };

  const handleEditDetails = () => {
    setIsDropdownOpen(false);
    // Navigate to edit details page (to be implemented)
    console.log('Navigate to edit details');
  };

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    // Handle sign out logic
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        Smart<span className="logo-highlight">CV</span>
      </div>

      <div className="navbar-user" ref={dropdownRef}>
        <button
          className="navbar-user-btn"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="navbar-user-avatar">
            {currentUser.initials}
          </div>
          <span className="navbar-user-name">{currentUser.name}</span>
          <svg
            className={`navbar-dropdown-icon ${isDropdownOpen ? 'open' : ''}`}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="navbar-dropdown">
            <button className="navbar-dropdown-item" onClick={handleProfile}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M0 14C0 11.2386 2.23858 9 5 9H11C13.7614 9 16 11.2386 16 14V16H0V14Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Profile
            </button>
            <button className="navbar-dropdown-item" onClick={handleEditDetails}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11.3333 1.99998C11.5084 1.82487 11.7163 1.68601 11.9447 1.59128C12.1731 1.49655 12.4173 1.44775 12.6667 1.44775C12.916 1.44775 13.1602 1.49655 13.3886 1.59128C13.617 1.68601 13.8249 1.82487 14 1.99998C14.1751 2.17509 14.314 2.38305 14.4087 2.61147C14.5034 2.83989 14.5522 3.08405 14.5522 3.33331C14.5522 3.58258 14.5034 3.82674 14.4087 4.05516C14.314 4.28358 14.1751 4.49154 14 4.66665L5.00001 13.6666L1.33334 14.6666L2.33334 11L11.3333 1.99998Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit Details
            </button>
            <div className="navbar-dropdown-divider"></div>
            <button className="navbar-dropdown-item danger" onClick={handleSignOut}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 14H3.33333C2.89131 14 2.46738 13.8244 2.15482 13.5118C1.84226 13.1993 1.66667 12.7754 1.66667 12.3333V3.66667C1.66667 3.22464 1.84226 2.80072 2.15482 2.48816C2.46738 2.17559 2.89131 2 3.33333 2H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 11.3333L14.3333 8L11 4.66667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.3333 8H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
