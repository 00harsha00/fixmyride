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

// Clean up references before removing a product
productSchema.pre('remove', async function (next) {
  try {
    const productId = this._id;
    await Cart.updateMany({}, { $pull: { items: { productId } } });
    await Order.updateMany({}, { $pull: { items: { productId } } });
    await Wishlist.deleteMany({ productId });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Product', productSchema);