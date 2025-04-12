import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import '../styles/CarLandingPage.css'; // Consider renaming to GasLandingPage.css if styles diverge
import Footer from './Footer';
import getLocationAndSend from '../utils/getLocation';
import { FaDirections } from 'react-icons/fa'; // For the directions symbol

// Import images
import electricCar1 from '../assets/electricCar1.jpg';
import electricCar2 from '../assets/electricCar2.jpg';
import electricCar3 from '../assets/electricCar3.jpg';
import electricCar4 from '../assets/electricCar4.jpg';
import electricCar5 from '../assets/electricCar5.jpg';
import electricCar6 from '../assets/electricCar6.jpg'; // Use relevant images for gas stations
import defaultCarMechanic from '../assets/defaultCarMechanic.jpg'; // Default image (consider renaming to defaultGasStation)

const GasLandingPage = () => {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState({}); // State to toggle map visibility for each card

  // Use exactly 4 images for the 2x2 grid (replace with relevant images for electric charging stations)
  const images = [
    electricCar1,
    electricCar2,
    electricCar3,
    electricCar4,
    electricCar5,
    electricCar6,
  ];

  const handleGetStarted = () => {
    setLoading(true);

    getLocationAndSend(
      async (data) => {
        alert('Location sent successfully!');

        const { latitude, longitude } = data;

        const type = 'gas_station'; // Type for electric vehicle charging stations
        const response = await fetch(
          `http://localhost:5000/api/nearby?latitude=${latitude}&longitude=${longitude}&type=${type}`
        );

        const nearbyData = await response.json();
        console.log('Nearby Data:', nearbyData); // Debug the data

        if (nearbyData.status === 'success') {
          // Filter out invalid entries
          const validPlaces = nearbyData.data.filter(
            (place) =>
              place &&
              place.id &&
              place.name &&
              place.latitude &&
              place.longitude
          );

          setNearbyPlaces(validPlaces);
        } else {
          alert(nearbyData.message || 'No nearby electric charging stations found');
          setNearbyPlaces([]);
        }

        setLoading(false);
      },
      (error) => {
        alert('Location error: ' + error);
        setLoading(false);
      }
    );
  };

  const mapContainerStyle = {
    width: '100%',
    height: '200px',
  };

  // Toggle map visibility for a specific place
  const toggleMap = (placeId) => {
    setShowMap((prev) => ({
      ...prev,
      [placeId]: !prev[placeId],
    }));
  };

  return (
    <>
      <section className="car-landing-section">
        <div className="car-landing-content">
          <h1>Looking for Electric Charging Stations?</h1>
          <p>
            Find the nearest electric charging stations with our easy-to-use platform. Whether you’re on a road trip or need a quick charge, we connect you with reliable stations in minutes.
          </p>
          <div className="car-landing-buttons">
            <button className="get-started-btn" onClick={handleGetStarted}>
              Get Started
            </button>
            <a href="#" className="live-demo-link">
              Live Demo →
            </a>
          </div>
        </div>
        <div className="car-landing-images">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Charging Station ${index + 1}`}
              className="car-image"
            />
          ))}
        </div>

        {nearbyPlaces.length > 0 && (
          <div className="nearby-places">
            <h2>Nearby Electric Charging Stations</h2>
            <div className="places-grid">
              <LoadScript googleMapsApiKey="AIzaSyChzhBmLC8-RtoSGRyo1RAh0cm9qTTlyMk">
                {nearbyPlaces.map((place) => (
                  <motion.div
                    key={place.id}
                    className="place-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="place-image">
                      <img
                        src={
                          place.photo_reference
                            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photo_reference}&key=AIzaSyChzhBmLC8-RtoSGRyo1RAh0cm9qTTlyMk`
                            : defaultCarMechanic
                        }
                        alt={place.name}
                        onError={(e) => (e.target.src = defaultCarMechanic)}
                      />
                    </div>
                    <div className="place-details">
                      <div className="place-header">
                        <h3>{place.name}</h3>
                        <button
                          className="directions-btn"
                          onClick={() => toggleMap(place.id)}
                          title="Show Directions"
                        >
                          <FaDirections />
                        </button>
                      </div>
                      <p>Reviews: {place.total_reviews || 'N/A'}</p>
                      <p>Open Now: {place.is_open_now ? 'Yes' : 'No'}</p>
                    </div>
                    {showMap[place.id] && (
                      <motion.div
                        className="place-map"
                        initial={{ height: 0 }}
                        animate={{ height: '200px' }}
                        transition={{ duration: 0.3 }}
                      >
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={{
                            lat: place.latitude,
                            lng: place.longitude,
                          }}
                          zoom={15}
                        >
                          <Marker
                            position={{
                              lat: place.latitude,
                              lng: place.longitude,
                            }}
                          />
                        </GoogleMap>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </LoadScript>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default GasLandingPage;