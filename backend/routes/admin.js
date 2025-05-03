const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const adminOnly = require('../middleware/adminOnly');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Apply authentication and admin-only middleware to all routes
router.use(authenticateToken);
router.use(adminOnly);

// --- Users ---
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.json({ status: 'success', data: users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ msg: 'Cannot delete admin users' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Orders ---
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'username email').populate('items.productId');
    // Filter out invalid items in each order
    const validOrders = orders.map(order => {
      order.items = order.items.filter(item => item.productId);
      return order;
    }).filter(order => order.items.length > 0);
    res.json({ status: 'success', data: validOrders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.patch('/orders/:id', async (req, res) => {
  const { status } = req.body;
  if (!['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json({ status: 'success', data: order });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Products ---
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ status: 'success', data: products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/products', async (req, res) => {
  const { name, originalPrice, discountedPrice, discount, rating, reviews, imageUrl, category } = req.body;
  if (!name || !originalPrice || !discountedPrice || !discount || !imageUrl) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }
  try {
    const product = new Product({
      name,
      originalPrice,
      discountedPrice,
      discount,
      rating: rating || 5,
      reviews: reviews || 1,
      imageUrl,
      category: category || 'Auto parts',
    });
    await product.save();
    res.json({ status: 'success', data: product });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.patch('/products/:id', async (req, res) => {
  const { name, originalPrice, discountedPrice, discount, rating, reviews, imageUrl, category } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    product.name = name || product.name;
    product.originalPrice = originalPrice || product.originalPrice;
    product.discountedPrice = discountedPrice || product.discountedPrice;
    product.discount = discount || product.discount;
    product.rating = rating || product.rating;
    product.reviews = reviews || product.reviews;
    product.imageUrl = imageUrl || product.imageUrl;
    product.category = category || product.category;
    await product.save();
    res.json({ status: 'success', data: product });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Payments (Simulated from Orders) ---
router.get('/payments', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'username email');
    const payments = orders.map(order => ({
      orderId: order._id,
      user: order.userId,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      // Simulated payment details
      paymentId: `PAY-${order._id.toString().slice(-8)}`,
      paymentMethod: 'Credit Card', // Placeholder; you can extend this
      paymentStatus: order.status === 'Delivered' ? 'Completed' : 'Pending',
    }));
    res.json({ status: 'success', data: payments });
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;