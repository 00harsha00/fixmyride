import React, { useState, useEffect, useContext } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/CarLandingPage.css';
import useNearbyPlaces from '../hooks/useNearbyPlaces';
import { FaDirections, FaHeart, FaShoppingCart } from 'react-icons/fa';
import supercar1 from '../assets/supercar1.jpg';
import supercar2 from '../assets/supercar2.jpg';
import supercar3 from '../assets/supercar3.jpg';
import supercar4 from '../assets/supercar4.jpg';
import supercar5 from '../assets/supercar5.jpg';
import supercar6 from '../assets/supercar6.jpg';
import defaultCarMechanic from '../assets/defaultCarMechanic.jpg';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const CarLandingPage = () => {
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
    const [photoErrors, setPhotoErrors] = useState({});

    const images = [supercar1, supercar2, supercar3, supercar4, supercar5, supercar6];

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('demo') === 'true' && !showDemo) {
            toggleDemo();
        }
    }, [location.search]);

    const handleGetStarted = () => {
        console.log('Fetching nearby places with type: car_repair');
        fetchNearbyPlaces('car_repair').then(() => {
            console.log('Nearby places fetched:', nearbyPlaces);
        }).catch((err) => {
            console.error('Error in fetchNearbyPlaces:', err);
        });
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
                setProductsError(data.message || 'Failed to fetch car products');
                setProducts([]);
            }
        } catch (error) {
            setProductsError('Error fetching car products: ' + error.message);
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

    const handleImageError = (placeId, e) => {
        if (!photoErrors[placeId]) {
            setPhotoErrors((prev) => ({
                ...prev,
                [placeId]: { count: 1, timestamp: Date.now() },
            }));
            setTimeout(() => {
                e.target.src = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
            }, 1000 * Math.pow(2, photoErrors[placeId]?.count || 1));
        } else if (photoErrors[placeId].count < 3) {
            setPhotoErrors((prev) => ({
                ...prev,
                [placeId]: { count: prev[placeId].count + 1, timestamp: Date.now() },
            }));
            setTimeout(() => {
                e.target.src = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
            }, 1000 * Math.pow(2, photoErrors[placeId].count));
        } else {
            e.target.src = defaultCarMechanic;
        }
    };

    return (
        <section className="car-landing-section">
            <div className="car-landing-content">
                <h1>Looking for Car Mechanic?</h1>
                <p>
                    Find the best car mechanics near you with our easy-to-use platform. Whether you need a quick oil change, tire rotation, or engine diagnostics, we connect you with trusted professionals in minutes.
                </p>
                <div className="car-landing-buttons">
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
            <div className="car-landing-images">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Car ${index + 1}`}
                        className="car-image"
                        loading="lazy"
                    />
                ))}
            </div>

            {showDemo && (
                <section className="auto-parts-section">
                    <h2>Car Parts</h2>
                    {productsLoading && <div className="loading-spinner">Loading products...</div>}
                    {productsError && <div className="error-message">{productsError}</div>}
                    {!productsLoading && !productsError && products.length === 0 && (
                        <div className="no-products">No car parts available.</div>
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
                                            src={part.image || defaultCarMechanic}
                                            alt={part.name}
                                            onError={(e) => (e.target.src = defaultCarMechanic)}
                                            loading="lazy"
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
                    <h2>Nearby Car Mechanics</h2>
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
                                                    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${place.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
                                                    : defaultCarMechanic
                                            }
                                            alt={place.name}
                                            onError={(e) => handleImageError(place.photo_reference, e)}
                                            loading="lazy"
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
            {Object.keys(photoErrors).length > 0 && (
                <div className="error-message">
                    Some photos failed to load due to API limits. Please try again later.
                </div>
            )}
        </section>
    );
};

export default CarLandingPage;