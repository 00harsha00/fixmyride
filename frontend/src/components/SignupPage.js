import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/AuthPage.css';
import backgroundVideo from '../assets/background-video.mp4';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SignupPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      console.log('Signup response:', data); // Log the response for debugging
      if (response.ok) {
        if (!data.user || !data.token) {
          setError('Invalid signup response: Missing user or token');
          return;
        }
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.msg || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
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
          <h2 className="auth-title">Sign Up</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label className="auth-label">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Sign Up
            </button>
          </form>
          <p className="auth-link-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;