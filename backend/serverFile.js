const express = require("express");
const mongoose = require('mongoose');
const axios = require("axios");
const cors = require('cors');
require("dotenv").config();
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const path = require('path');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files for images
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
    console.error('GOOGLE_MAPS_API_KEY is not defined in .env file');
}

// Validate place type
const validPlaceTypes = [
    'car_repair',
    'bicycle_store',
    'electric_vehicle_charging_station',
    // Add other valid types as needed
];

// Fetch nearby places
app.get("/api/nearby", async (req, res) => {
    try {
        const { latitude, longitude, type } = req.query;

        // Validate parameters
        if (!latitude || !longitude || !type) {
            return res.status(400).json({ status: "error", message: "Missing parameters" });
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ status: "error", message: "Invalid latitude or longitude" });
        }

        if (!validPlaceTypes.includes(type)) {
            return res.status(400).json({ status: "error", message: `Invalid place type: ${type}` });
        }

        if (!GOOGLE_MAPS_API_KEY) {
            return res.status(500).json({ status: "error", message: "Google Maps API key is missing" });
        }

        const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;
        console.log('Google Places API URL:', googleMapsUrl);

        const response = await axios.get(googleMapsUrl);
        const apiResponse = response.data;
        console.log(`Google Places API Response for type=${type}:`, apiResponse);

        if (apiResponse.status !== 'OK') {
            return res.status(400).json({
                status: "error",
                message: `Google Places API error: ${apiResponse.status}`,
                details: apiResponse.error_message || 'No additional details'
            });
        }

        let places = apiResponse.results
            .map((place, index) => {
                if (
                    !place.place_id ||
                    !place.name ||
                    !place.geometry?.location?.lat ||
                    !place.geometry?.location?.lng
                ) {
                    console.warn(`Skipping invalid place at index ${index}:`, place);
                    return null;
                }

                return {
                    id: place.place_id,
                    name: place.name,
                    address: place.vicinity || "No address available",
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                    rating: place.rating || "No rating",
                    total_reviews: place.user_ratings_total || 0,
                    is_open_now: place.opening_hours?.open_now || false,
                    types: place.types,
                    photo_reference: place.photos?.[0]?.photo_reference || null,
                };
            })
            .filter(place => place !== null);

        // Limit to 5 places
        places = places.slice(0, 5);
        console.log('Mapped Places:', places);

        res.json({ status: "success", data: places });
    } catch (error) {
        console.error("Error fetching nearby places:", error.message);
        res.status(500).json({ status: "error", message: "Failed to fetch nearby places", error: error.message });
    }
});

// Fetch products with optional category filter
app.get("/api/products", async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category: category.toLowerCase() } : {};
        const products = await Product.find(query);
        if (products.length === 0) {
            return res.status(404).json({ status: "error", message: "No products found" });
        }
        const formattedProducts = products.map((product) => ({
            _id: product._id,
            name: product.name,
            price: product.originalPrice,
            discount: product.discount || 0,
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            image: product.imageUrl || null,
            category: product.category,
            discountedPrice: product.discountedPrice || product.originalPrice,
            __v: product.__v,
        }));
        res.json({ status: "success", data: formattedProducts });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ status: "error", message: "Failed to fetch products" });
    }
});

// Get route and waypoints
app.get("/api/route", async (req, res) => {
    try {
        const { source_lat, source_lng, dest_lat, dest_lng } = req.query;
        if (!source_lat || !source_lng || !dest_lat || !dest_lng) {
            return res.status(400).json({ status: "error", message: "Missing parameters" });
        }

        const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${source_lat},${source_lng}&destination=${dest_lat},${dest_lng}&key=${GOOGLE_MAPS_API_KEY}`;
        
        const response = await axios.get(directionsUrl);
        const route = response.data;

        const waypoints = route.routes[0]?.legs[0]?.steps.map(step => ({
            lat: step.end_location.lat,
            lng: step.end_location.lng
        }));

        res.json({ status: "success", data: { route, waypoints } });
    } catch (error) {
        console.error("Error fetching route:", error.message);
        res.status(500).json({ status: "error", message: "Failed to fetch route" });
    }
});

// Handle location data
app.post('/location', (req, res) => {
    const { latitude, longitude, timestamp } = req.body;
    console.log('Received location:', { latitude, longitude, timestamp });
  
    res.status(200).json({
        status: "success",
        message: 'Location received successfully',
        data: { latitude, longitude, timestamp },
    });
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));