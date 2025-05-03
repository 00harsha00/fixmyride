const mongoose = require('mongoose');
const Product = require('../models/Product.js');
require('dotenv').config({ path: '../.env' });

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => console.error(err));

const products = [
  {
    name: 'All-Season Tire',
    originalPrice: 300.0,
    discountedPrice: 240.0,
    discount: 20,
    rating: 5,
    reviews: 1,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/fixmyride-81879.firebasestorage.app/o/tire.jpg?alt=media&token=6b1daef0-303f-4006-b6bb-4cce2bb9c78e',
    category: 'autoparts',
  },
  {
    name: 'Black Grille',
    originalPrice: 300.0,
    discountedPrice: 200.0,
    discount: 34,
    rating: 5,
    reviews: 1,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/fixmyride-81879.firebasestorage.app/o/grille.jpg?alt=media&token=dfde9294-42b2-43fd-8b0f-500b9030ccfd',
    category: 'autoparts',
  },
  {
    name: 'Coil Springs',
    originalPrice: 250.0,
    discountedPrice: 220.0,
    discount: 12,
    rating: 5,
    reviews: 1,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/fixmyride-81879.firebasestorage.app/o/coilspring.jpg?alt=media&token=468415e1-3f0c-4dc5-8096-50fdf88b7473',
    category: 'autoparts',
  },
  {
    name: 'Engine Pistons',
    originalPrice: 380.0,
    discountedPrice: 290.0,
    discount: 24,
    rating: 5,
    reviews: 1,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/fixmyride-81879.firebasestorage.app/o/enginepistons.jpg?alt=media&token=df28889c-bba2-455a-80de-cf02a137f6aa',
    category: 'autoparts',
  },
];

const seedDB = async () => {
  try {
    await Product.deleteMany({});
    console.log('Existing products removed');
    await Product.insertMany(products);
    console.log('Sample products inserted');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDB();
