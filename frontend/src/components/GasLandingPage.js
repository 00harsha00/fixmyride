import React, { useState, useEffect, useContext } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/GasLandingPage.css';
import Footer from './Footer';
import useNearbyPlaces from '../hooks/useNearbyPlaces';
import { FaDirections, FaHeart, FaShoppingCart } from 'react-icons/fa';
import electricCar1 from '../assets/electricCar1.jpg';
import electricCar2 from '../assets/electricCar2.jpg';
import electricCar3 from '../assets/electricCar3.jpg';
import electricCar4 from '../assets/electricCar4.jpg';
import electricCar5 from '../assets/electricCar5.jpg';
import electricCar6 from '../assets/electricCar6.jpg';
import defaultCarMechanic from '../assets/defaultCarMechanic.jpg';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const GasLandingPage = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { nearbyPlaces, loading, error, fetchNearbyPlaces } = useNearbyPlaces(BASE_URL);
    const [showMap, setShowMap] = useState({});
    const [showDemo, setShowDemo] = useState(false);
    const [wishlist, setWishlist] = useState({});
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState(null);
    const [quantities, setQuantities] = useState({});

    const images = [electricCar1, electricCar2, electricCar3, electricCar4, electricCar5, electricCar6];

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('demo') === 'true' && !showDemo) {
            toggleDemo();
        }
    }, [location.search]);

    const handleGetStarted = () => {
        fetchNearbyPlaces('electric_vehicle_charging_station');
    };

    const fetchProducts = async () => {
        setProductsLoading(true);
        setProductsError(null);
        try {
            const response = await fetch(`${BASE_URL}/api/products?category=autoparts`);
            const data = await response.json();
            if (data.status === 'success' && Array.isArray(data.data)) {
                setProducts(data.data);
                const initialQuantities = {};
                const initialWishlist = {};
                data.data.forEach(product => {
                    initialQuantities[product._id] = 1;
                    initialWishlist[product._id] = false;
                });
                setQuantities(initialQuantities);
                setWishlist(initialWishlist);
            } else {
                setProductsError(data.message || 'Failed to fetch charging products');
                setProducts([]);
            }
        } catch (error) {
            setProductsError('Error fetching charging products: ' + error.message);
            setProducts([]);
        } finally {
            setProductsLoading(false);
        }
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

    const toggleDemo = () => {
        setShowDemo((prev) => {
            const newShowDemo = !prev;
            if (newShowDemo && products.length === 0) {
                fetchProducts();
            }
            return newShowDemo;
        });
    };

    const checkLogin = () => {
        if (!user) {
            navigate('/login', { state: { from: location, demo: showDemo } });
            return false;
        }
        return true;
    };

    const handleAddToCart = async (productId) => {
        if (!checkLogin()) return;
        try {
            const quantity = quantities[productId] || 1;
            const response = await fetch(`${BASE_URL}/api/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                alert('Added to cart successfully!');
            } else {
                alert(data.message || 'Failed to add to cart');
            }
        } catch (error) {
            alert('Error adding to cart: ' + error.message);
        }
    };

    const handleWishlistToggle = async (productId) => {
        if (!checkLogin()) return;
        try {
            const isInWishlist = wishlist[productId];
            const url = isInWishlist
                ? `${BASE_URL}/api/wishlist/remove/${productId}`
                : `${BASE_URL}/api/wishlist/add`;
            const method = isInWishlist ? 'DELETE' : 'POST';
            const body = isInWishlist ? null : JSON.stringify({ productId });
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body,
            });
            const data = await response.json();
            if (data.status === 'success') {
                setWishlist((prev) => ({
                    ...prev,
                    [productId]: !isInWishlist,
                }));
                alert(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
            } else {
                alert(data.message || 'Failed to update wishlist');
            }
        } catch (error) {
            alert('Error updating wishlist: ' + error.message);
        }
    };

    const updateQuantity = (productId, delta) => {
        if (!checkLogin()) return;
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + delta),
        }));
    };

    return (
        <section className="gas-landing-section">
            <div className="gas-landing-content">
                <h1>Looking for Electric Charging Stations?</h1>
                <p>
                    Find the nearest electric charging stations with our easy-to-use platform. Whether you’re on a road trip or need a quick charge, we connect you with reliable stations in minutes.
                </p>
                <div className="gas-landing-buttons">
                    <button
                        className="get-started-btn"
                        onClick={handleGetStarted}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Get Started'}
                    </button>
                    <button className="live-demo-link" onClick={toggleDemo}>
                        Live Demo →
                    </button>
                </div>
                {error && <div className="error-message">{error}</div>}
            </div>
            <div className="gas-landing-images">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Charging Station ${index + 1}`}
                        className="gas-image"
                    />
                ))}
            </div>

            {showDemo && (
                <section className="auto-parts-section">
                    <h2>Charging Accessories</h2>
                    {productsLoading && <div className="loading-spinner">Loading products...</div>}
                    {productsError && <div className="error-message">{productsError}</div>}
                    {!productsLoading && !productsError && products.length === 0 && (
                        <div className="no-products">No charging accessories available.</div>
                    )}
                    {products.length > 0 && (
                        <div className="auto-parts-grid">
                            {products.map((part) => (
                                <motion.div
                                    key={part._id}
                                    className="auto-part-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {part.discount > 0 && (
                                        <span className="discount-badge">{part.discount}% OFF</span>
                                    )}
                                    <div className="wishlist-icons">
                                        <button
                                            className="wishlist-btn"
                                            onClick={() => handleWishlistToggle(part._id)}
                                            title={wishlist[part._id] ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                        >
                                            <FaHeart
                                                className={`wishlist-icon ${wishlist[part._id] ? 'active' : ''}`}
                                            />
                                        </button>
                                    </div>
                                    <div className="auto-part-image">
                                        <img
                                            src={part.image || 'https://via.placeholder.com/150'}
                                            alt={part.name}
                                            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                                        />
                                    </div>
                                    <div className="auto-part-details">
                                        <span className="category">{part.category}</span>
                                        <h3>{part.name}</h3>
                                        <div className="price">
                                            {part.discount > 0 ? (
                                                <>
                                                    <span className="original-price">
                                                        ${part.price.toFixed(2)}
                                                    </span>
                                                    <span className="discounted-price">
                                                        ${(part.price * (1 - part.discount / 100)).toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="discounted-price">
                                                    ${part.price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="rating">
                                            {'★'.repeat(Math.round(part.rating))}
                                            {'☆'.repeat(5 - Math.round(part.rating))} ({part.rating})
                                        </div>
                                        <div className="cart-actions">
                                            <div className="quantity-selector">
                                                <button onClick={() => updateQuantity(part._id, -1)}>-</button>
                                                <span>{quantities[part._id]}</span>
                                                <button onClick={() => updateQuantity(part._id, 1)}>+</button>
                                            </div>
                                            <button
                                                className="add-to-cart-btn"
                                                onClick={() => handleAddToCart(part._id)}
                                            >
                                                <FaShoppingCart />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {nearbyPlaces.length > 0 && GOOGLE_MAPS_API_KEY && (
                <div className="nearby-places">
                    <h2>Nearby Electric Charging Stations</h2>
                    <div className="places-grid">
                        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
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
                                                    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
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
            {!GOOGLE_MAPS_API_KEY && nearbyPlaces.length > 0 && (
                <div className="error-message">
                    Google Maps API key is missing. Please check your environment variables.
                </div>
            )}
        </section>
    );
};

export default GasLandingPage;
