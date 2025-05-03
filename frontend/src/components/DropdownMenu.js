import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/DropdownMenu.css';

const DropdownMenu = ({ onMouseEnter, onMouseLeave }) => {
  const { logout, cartCount } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      className="dropdown-menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ul>
        <li>
          <Link to="/cart">
            Cart {cartCount > 0 && <span className="cart-count">({cartCount})</span>}
          </Link>
        </li>
        <li><Link to="/wishlist">Wishlist</Link></li>
        <li><Link to="/payment">Checkout</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropdownMenu;