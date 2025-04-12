const express = require("express");
const mongoose = require('mongoose');
const axios = require("axios");
const cors = require('cors');
require("dotenv").config();
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
app.get("/api/nearby", async (req, res) => {
    try {
        const { latitude, longitude, type } = req.query;
        if (!latitude || !longitude || !type) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&rankby=distance&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;
        
        const response = await axios.get(googleMapsUrl);
        
        // Log the raw API response for debugging
        console.log('Google Places API Response:', response.data);

        // Validate and map the results
        const places = response.data.results
            .map((place, index) => {
                // Check for required fields
                if (
                    !place.place_id ||
                    !place.name ||
                    !place.geometry?.location?.lat ||
                    !place.geometry?.location?.lng
                ) {
                    console.warn(`Skipping invalid place at index ${index}:`, place);
                    return null; // Return null for invalid entries
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
            .filter(place => place !== null) // Remove invalid entries
            .slice(0, 5); // Limit to 5 valid results

        // Log the mapped places for debugging
        console.log('Mapped Places:', places);

        // Check if any valid places were found
        if (places.length === 0) {
            return res.status(404).json({ status: "error", message: "No valid places found" });
        }

        res.json({ status: "success", data: places });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});


//This API provides the best route and extracts waypoints where we can later query for gas stations and charging stations.
//GET /api/route?source_lat=12.9716&source_lng=77.5946&dest_lat=13.0827&dest_lng=80.2707
app.get("/api/route", async (req, res) => {
    try {
        const { source_lat, source_lng, dest_lat, dest_lng } = req.query;
        if (!source_lat || !source_lng || !dest_lat || !dest_lng) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${source_lat},${source_lng}&destination=${dest_lat},${dest_lng}&key=${GOOGLE_MAPS_API_KEY}`;
        
        const response = await axios.get(directionsUrl);
        const route = response.data;

        // Extract waypoints (optional: for intermediate stops)
        const waypoints = route.routes[0]?.legs[0]?.steps.map(step => ({
            lat: step.end_location.lat,
            lng: step.end_location.lng
        }));

        res.json({ route, waypoints });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch route" });
    }
});

app.post('/location', (req, res) => {
    const { latitude, longitude, timestamp } = req.body;
    console.log('Received location:', { latitude, longitude, timestamp });
  
    // Process the location data (e.g., save to a database)
    // For now, just send a success response
    res.status(200).json({
      message: 'Location received successfully',
      latitude,
      longitude,
      timestamp,
    });
  });

//DB Mongo
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Routes
app.use('/api/auth', authRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
