const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const authenticateToken = require('../middleware/authenticateToken');

// Get user's wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ userId: req.user.userId }).populate('productId');
    res.json({ status: 'success', data: wishlistItems });
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add item to wishlist
router.post('/add', authenticateToken, async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ msg: 'Product ID is required' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const existingItem = await Wishlist.findOne({ userId: req.user.userId, productId });
    if (existingItem) {
      return res.status(400).json({ msg: 'Product already in wishlist' });
    }

    const wishlistItem = new Wishlist({ userId: req.user.userId, productId });
    await wishlistItem.save();
    res.json({ status: 'success', data: wishlistItem });
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Remove item from wishlist
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
  const { productId } = req.params;

  try {
    const wishlistItem = await Wishlist.findOneAndDelete({ userId: req.user.userId, productId });
    if (!wishlistItem) {
      return res.status(404).json({ msg: 'Product not found in wishlist' });
    }
    res.json({ status: 'success', message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;