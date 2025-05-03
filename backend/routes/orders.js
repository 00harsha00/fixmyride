const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const authenticateToken = require('../middleware/authenticateToken');

// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).populate('items.productId');
    res.json({ status: 'success', data: orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create a new order (checkout)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    const items = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.discountedPrice,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      userId: req.user.userId,
      items,
      totalAmount,
    });

    await order.save();

    // Clear the cart after creating the order
    cart.items = [];
    await cart.save();

    res.json({ status: 'success', data: order });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;