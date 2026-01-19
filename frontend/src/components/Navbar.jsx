import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../store/context";
import { logout } from "../store/action";

export default function Navbar() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate("/");
    window.location.reload(); // Ensure a full page refresh to clear any state
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm" style={{
      backgroundColor: '#4CAF50', // Light green background
      background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)' // Light green gradient
    }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#1a1a1a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            color: '#4CAF50',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            NT
          </div>
          <span className="brand-accent" style={{
            fontSize: '1.7rem',
            background: 'linear-gradient(90deg, #1B5E20, #2E7D32, #4CAF50)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '900',
            letterSpacing: '1px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '0 5px',
            borderRadius: '4px'
          }}>
            EMS
          </span>
        </Link>
        <div className="navbar-nav ms-auto align-items-center">
          <Link 
            className={`nav-link ${isActive('/') ? 'active' : ''}`} 
            to="/"
            style={{
              fontWeight: '500',
              position: 'relative',
              margin: '0 8px',
              padding: '8px 16px',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              color: isActive('/') ? '#fff' : 'rgba(255, 255, 255, 0.85)',
              textDecoration: 'none'
            }}
          >
            Home
          </Link>
          {state.user ? (
            <>
              <Link 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                to="/dashboard"
                style={{
                  fontWeight: '500',
                  position: 'relative',
                  margin: '0 8px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  transition: 'all 0.3s ease',
                  color: isActive('/dashboard') ? '#fff' : 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none'
                }}
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="btn btn-outline-light ms-3"
                style={{
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontWeight: '500',
                  borderWidth: '2px',
                  transition: 'all 0.3s ease'
                }}
              >
                Logout {state.user.username && `(${state.user.username})`}
              </button>
            </>
          ) : (
            // Empty fragment since we're removing the login button
            <></>
          )}
        </div>
      </div>
    </nav>
  );
}
