import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/PaymentPage.css';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const PaymentPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    if (!token) {
      setError('Please log in to proceed with payment');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Order placed successfully!');
        navigate('/orders');
      } else {
        setError(data.message || 'Failed to place order');
      }
    } catch (err) {
      setError('Failed to process payment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h2>Payment</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="payment-form">
        <h3>Mock Payment Gateway</h3>
        <p>Card Number: **** **** **** 1234</p>
        <p>Expiry: 12/25</p>
        <p>CVV: ***</p>
        <button
          className="pay-btn"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;