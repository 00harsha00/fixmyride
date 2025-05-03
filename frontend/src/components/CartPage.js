import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/CartPage.css';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CartPage = () => {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.status === 'success') {
          setCart(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await fetch('${BASE_URL}/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setCart(data.data);
      }
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const handleCheckout = () => {
    navigate('/payment');
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart && cart.items.length > 0 ? (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.productId._id} className="cart-item">
                <img src={item.productId.imageUrl} alt={item.productId.name} />
                <div className="cart-item-details">
                  <h3>{item.productId.name}</h3>
                  <p>Price: ${item.productId.discountedPrice.toFixed(2)}</p>
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${cart.items.reduce((total, item) => total + item.productId.discountedPrice * item.quantity, 0).toFixed(2)}</h3>
            <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;