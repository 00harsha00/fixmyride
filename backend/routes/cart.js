const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authenticateToken = require('../middleware/authenticateToken');

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId');
    if (!cart) {
      return res.json({ status: 'success', data: { userId: req.user.userId, items: [] } });
    }
    // Filter out items where productId is null
    cart.items = cart.items.filter(item => item.productId);
    res.json({ status: 'success', data: cart });
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ msg: 'Product ID and quantity are required' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    const updatedCart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId');
    updatedCart.items = updatedCart.items.filter(item => item.productId);
    res.json({ status: 'success', data: updatedCart });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
  const { productId } = req.params;

  try {
    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    const updatedCart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId');
    updatedCart.items = updatedCart.items.filter(item => item.productId);
    res.json({ status: 'success', data: updatedCart });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;