import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/OrdersPage.css';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const OrdersPage = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.status === 'success') {
          setOrders(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <h3>Order #{order._id}</h3>
              <p>Status: {order.status}</p>
              <p>Total: ${order.totalAmount.toFixed(2)}</p>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item._id} className="order-product">
                    <p>{item.productId.name} x {item.quantity}</p>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no orders.</p>
      )}
    </div>
  );
};

export default OrdersPage;