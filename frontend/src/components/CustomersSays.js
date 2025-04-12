import React, { useRef } from 'react';
import '../styles/Footer.css';

const CustomersSays = () => {
  const reviewsRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Customer Reviews Section */}
      <section className="customer-reviews">
        <h2>Our Customers Say</h2>
        <div className="reviews-grid" ref={reviewsRef}>
          <div className="review-card">
            <p>"Amazing service! Found a mechanic in minutes when my car broke down."</p>
            <h4>- John Doe</h4>
          </div>
          <div className="review-card">
            <p>"The bike repair was quick and affordable. Highly recommend!"</p>
            <h4>- Jane Smith</h4>
          </div>
          <div className="review-card">
            <p>"I love how easy it is to find nearby gas stations. Saved my trip!"</p>
            <h4>- Alex Brown</h4>
          </div>
          <div className="review-card">
            <p>"Great experience with their engine diagnostics. Very professional!"</p>
            <h4>- Sarah Johnson</h4>
          </div>
        </div>
      </section>

     
    </>
  );
};

export default CustomersSays