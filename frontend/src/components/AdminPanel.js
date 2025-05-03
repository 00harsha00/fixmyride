import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdminPanel.css';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const AdminPanel = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    originalPrice: '',
    discountedPrice: '',
    discount: '',
    rating: 5,
    reviews: 1,
    imageUrl: '',
    category: 'Auto parts',
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch data for each tab
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setUsers(data.data);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
  
      if (data.status === 'success' && Array.isArray(data.data)) {
        // Filter out any null or invalid orders
        const validOrders = data.data.filter(
          order => order && typeof order === 'object' && order.customer && typeof order.customer === 'object'
        );
        setOrders(validOrders);
      } else {
        setError(data.msg || 'Failed to load orders');
      }
    } catch (err) {
      setError('Failed to fetch orders');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setProducts(data.data);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setPayments(data.data);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Failed to fetch payments');
    }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'payments') fetchPayments();
  }, [activeTab, token]);

  // Handlers for Users
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setUsers(users.filter(user => user._id !== userId));
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  // Handlers for Orders
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status } : order
        ));
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  // Handlers for Products
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setProducts([...products, data.data]);
        setNewProduct({
          name: '',
          originalPrice: '',
          discountedPrice: '',
          discount: '',
          rating: 5,
          reviews: 1,
          imageUrl: '',
          category: 'Auto parts',
        });
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      originalPrice: product.originalPrice,
      discountedPrice: product.discountedPrice,
      discount: product.discount,
      rating: product.rating,
      reviews: product.reviews,
      imageUrl: product.imageUrl,
      category: product.category,
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/admin/products/${editingProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setProducts(products.map(product =>
          product._id === editingProduct._id ? data.data : product
        ));
        setEditingProduct(null);
        setNewProduct({
          name: '',
          originalPrice: '',
          discountedPrice: '',
          discount: '',
          rating: 5,
          reviews: 1,
          imageUrl: '',
          category: 'Auto parts',
        });
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`${BASE_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setProducts(products.filter(product => product._id !== productId));
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>
      {error && <p className="error">{error}</p>}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={activeTab === 'payments' ? 'active' : ''}
          onClick={() => setActiveTab('payments')}
        >
          Payments
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="tab-content">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={user.role === 'admin'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="tab-content">
          <h2>Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.userId?.username} ({order.userId?.email})</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <ul>
                      {order.items.map(item => (
                        <li key={item.productId._id}>
                          {item.productId.name} - {item.quantity} x ${item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="tab-content">
          <h2>Products</h2>
          <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="product-form">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Original Price"
              value={newProduct.originalPrice}
              onChange={(e) => setNewProduct({ ...newProduct, originalPrice: parseFloat(e.target.value) })}
              required
            />
            <input
              type="number"
              placeholder="Discounted Price"
              value={newProduct.discountedPrice}
              onChange={(e) => setNewProduct({ ...newProduct, discountedPrice: parseFloat(e.target.value) })}
              required
            />
            <input
              type="number"
              placeholder="Discount (%)"
              value={newProduct.discount}
              onChange={(e) => setNewProduct({ ...newProduct, discount: parseInt(e.target.value) })}
              required
            />
            <input
              type="number"
              placeholder="Rating"
              value={newProduct.rating}
              onChange={(e) => setNewProduct({ ...newProduct, rating: parseInt(e.target.value) })}
              min="1"
              max="5"
            />
            <input
              type="number"
              placeholder="Reviews"
              value={newProduct.reviews}
              onChange={(e) => setNewProduct({ ...newProduct, reviews: parseInt(e.target.value) })}
              min="0"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.imageUrl}
              onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
            {editingProduct && (
              <button type="button" onClick={() => {
                setEditingProduct(null);
                setNewProduct({
                  name: '',
                  originalPrice: '',
                  discountedPrice: '',
                  discount: '',
                  rating: 5,
                  reviews: 1,
                  imageUrl: '',
                  category: 'Auto parts',
                });
              }}>
                Cancel
              </button>
            )}
          </form>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Original Price</th>
                <th>Discounted Price</th>
                <th>Discount</th>
                <th>Rating</th>
                <th>Reviews</th>
                <th>Image URL</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.originalPrice.toFixed(2)}</td>
                  <td>${product.discountedPrice.toFixed(2)}</td>
                  <td>{product.discount}%</td>
                  <td>{product.rating}</td>
                  <td>{product.reviews}</td>
                  <td>{product.imageUrl}</td>
                  <td>{product.category}</td>
                  <td>
                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="tab-content">
          <h2>Payments</h2>
          <table>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.paymentId}>
                  <td>{payment.paymentId}</td>
                  <td>{payment.orderId}</td>
                  <td>{payment.user?.username} ({payment.user?.email})</td>
                  <td>${payment.totalAmount.toFixed(2)}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.paymentStatus}</td>
                  <td>{new Date(payment.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;