import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DropdownMenu from './DropdownMenu';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout, cartCount } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 1000);
    setTimeoutId(id);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

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
        {user ? (
          <li
            className="user-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="username">
              {user.username}
              {cartCount > 0 && <sup className="cart-count">{cartCount}</sup>}
            </span>
            {isDropdownOpen && (
              <DropdownMenu
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            )}
          </li>
        ) : (
          <li><Link to="/login">Login/Signup</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;