import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h2>Mechanic.</h2>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/car">Car</Link></li>
        <li><Link to="/bike">Bike</Link></li>
        <li><Link to="/gas">Gas</Link></li>
        <li><Link to="/community">Community</Link></li>
        {isAuthenticated ? (
          <li>
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          </li>
        ) : (
          <li><Link to="/login">Login/Signup</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;