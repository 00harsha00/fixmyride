import React, { useState } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import '../styles/CarLandingPage.css';
import Footer from './Footer';
import getLocationAndSend from '../utils/getLocation';
import { FaDirections } from 'react-icons/fa';

// Import images
import supercar1 from '../assets/supercar1.jpg';
import supercar2 from '../assets/supercar2.jpg';
import supercar3 from '../assets/supercar3.jpg';
import supercar4 from '../assets/supercar4.jpg';
import supercar5 from '../assets/supercar5.jpg';
import supercar6 from '../assets/supercar6.jpg';
import defaultCarMechanic from '../assets/defaultCarMechanic.jpg';

const CarLandingPage = () => {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState({});

  const images = [supercar1, supercar2, supercar3, supercar4, supercar5, supercar6];

  const handleGetStarted = () => {
    setLoading(true);

    getLocationAndSend(
      async (data) => {
        alert('Location sent successfully!');

        const { latitude, longitude } = data;

        const type = 'car_repair';
        const response = await fetch(
          `http://localhost:5000/api/nearby?latitude=${latitude}&longitude=${longitude}&type=${type}`
        );

        const nearbyData = await response.json();
        console.log('Nearby Data:', nearbyData.data); // Debug the data

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
          alert(nearbyData.message || 'No nearby Car mechanics found');
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
          <h1>Looking for Car Mechanic?</h1>
          <p>
            Find the best car mechanics near you with our easy-to-use platform. Whether you need a quick oil change, tire rotation, or engine diagnostics, we connect you with trusted professionals in minutes.
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
              alt={`Car ${index + 1}`}
              className="car-image"
            />
          ))}
        </div>


        {nearbyPlaces.length > 0 && (
          <div className="nearby-places">
            <h2>Nearby Car Mechanics</h2>
            <div className="places-grid">
              <LoadScript googleMapsApiKey="AIzaSyChzhBmLC8-RtoSGRyo1RAh0cm9qTTlyMk">
                {nearbyPlaces.map((place) => (
                  <div key={place.id} className="place-card">
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
                      <div className="place-map">
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
                      </div>
                    )}
                  </div>
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

export default CarLandingPage;