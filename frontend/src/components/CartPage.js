import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/CartPage.css';
const BASE_URL = process.env.REACT_APP_BASE_URL;

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
        console.log('Cart API response:', data); // Log the response for debugging
        if (data.status === 'success' && data.data) {
          // Filter out items where productId is null or undefined
          const validCart = {
            ...data.data,
            items: data.data.items?.filter(
              item => item && item.productId && typeof item.productId === 'object'
            ) || [],
          };
          setCart(validCart);
        } else {
          setError(data.message || 'Failed to fetch cart');
        }
      } catch (err) {
        setError('Failed to fetch cart: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCart();
    } else {
      setError('Please log in to view your cart');
      setLoading(false);
    }
  }, [token]);

  const updateQuantity = async (productId, quantity) => {
    if (!productId || quantity < 1) return; // Prevent invalid updates
    try {
      const response = await fetch(`${BASE_URL}/api/cart/update`, {
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
      } else {
        console.error('Failed to update quantity:', data.message);
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
              <div key={item.productId?._id || item._id} className="cart-item">
                <img
                  src={item.productId?.imageUrl || '/path/to/default-image.jpg'}
                  alt={item.productId?.name || 'Product'}
                  onError={(e) => (e.target.src = '/path/to/default-image.jpg')}
                />
                <div className="cart-item-details">
                  <h3>{item.productId?.name || 'Unknown Product'}</h3>
                  <p>Price: ${item.productId?.discountedPrice?.toFixed(2) || '0.00'}</p>
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>
              Total: $
              {cart.items
                .reduce((total, item) => {
                  const price = item.productId?.discountedPrice || 0;
                  return total + price * item.quantity;
                }, 0)
                .toFixed(2)}
            </h3>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;