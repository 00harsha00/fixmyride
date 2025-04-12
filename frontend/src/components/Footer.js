import React, { useRef } from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const reviewsRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="/careers">Careers</a>
          <a href="/downloads">Downloads</a>
          <a href="/qa">Q&A</a>
        </div>
        <div className="footer-social">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <span className="social-icon">🐦</span>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <span className="social-icon">📷</span>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <span className="social-icon">in</span>
          </a>
        </div>
        <button className="back-to-top" onClick={scrollToTop}>
          ↑
        </button>
      </footer>
    </>
  );
};

export default Footer;