import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/PaymentPage.css';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;


const PaymentPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Order placed successfully!');
        navigate('/orders');
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (err) {
      alert('Failed to process payment');
    }
  };

  return (
    <div className="payment-page">
      <h2>Payment</h2>
      <div className="payment-form">
        <h3>Mock Payment Gateway</h3>
        <p>Card Number: **** **** **** 1234</p>
        <p>Expiry: 12/25</p>
        <p>CVV: ***</p>
        <button className="pay-btn" onClick={handlePayment}>Pay Now</button>
      </div>
    </div>
  );
};

export default PaymentPage;