const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 5,
  },
  reviews: {
    type: Number,
    default: 1,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'Auto parts',
  },
});

module.exports = mongoose.model('Product', productSchema);