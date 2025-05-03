import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/OrdersPage.css';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const OrdersPage = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log('Orders API response:', data); // Log for debugging
        if (data.status === 'success' && Array.isArray(data.data)) {
          // Filter out invalid orders
          const validOrders = data.data.filter(
            order =>
              order &&
              typeof order === 'object' &&
              order.items &&
              Array.isArray(order.items) &&
              order.customer &&
              typeof order.customer === 'object'
          );
          setOrders(validOrders);
        } else {
          setError(data.msg || 'Failed to load orders');
        }
      } catch (err) {
        setError('Failed to fetch orders: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setError('Please log in to view your orders');
      setLoading(false);
    }
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
              <p>Status: {order.status || 'Unknown'}</p>
              <p>Total: ${(order.totalAmount || 0).toFixed(2)}</p>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item._id} className="order-product">
                    <p>
                      {(item.productId?.name || 'Unknown Product')} x {item.quantity || 0}
                    </p>
                    <p>${(item.price || 0).toFixed(2)}</p>
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