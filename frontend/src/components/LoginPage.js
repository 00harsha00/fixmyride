import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/AuthPage.css';
import backgroundVideo from '../assets/background-video.mp4';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });
      const data = await response.json();
      console.log('Login response:', data); // Log the response for debugging
      if (response.ok) {
        if (!data.user || !data.token) {
          setError('Invalid login response: Missing user or token');
          return;
        }
        login(data.user, data.token);
        const redirectTo = location.state?.from?.pathname === '/car' && location.state?.demo
          ? `${from}?demo=true`
          : from;
        navigate(redirectTo, { replace: true });
      } else {
        setError(data.msg || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-video-section">
        <video autoPlay loop muted className="auth-video">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="auth-video-overlay"></div>
      </div>
      <div className="auth-form-section">
        <div className="auth-form-container">
          <h2 className="auth-title">Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">Username or Email</label>
            <input
              type="text"
              placeholder="Username or Email"
              className="auth-input"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
            <label className="auth-label">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="auth-button">
              Login
            </button>
          </form>
          <p className="auth-link-text">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;