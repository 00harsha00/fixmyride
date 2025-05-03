import React, { useState, useEffect, useContext } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/CommunityPage.css';
import { FaMapMarkerAlt, FaComment, FaPlus } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const CommunityPage = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [newPost, setNewPost] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/community' } });
      return;
    }
    fetchServices();
    fetchPosts();
  }, [user, navigate]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/community/services`);
      const data = await response.json();
      if (data.status === 'success') {
        setServices(data.data);
      } else {
        setError(data.message || 'Failed to fetch services');
      }
    } catch (err) {
      setError('Error fetching services: Stay Tune will get back to you soon!');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/community/posts`);
      const data = await response.json();
      if (data.status === 'success') {
        setPosts(data.data);
      } else {
        setError(data.message || 'Failed to fetch posts');
      }
    } catch (err) {
      setError('Error fetching posts: Stay Tune will get back to you soon!');
    }
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      const response = await fetch(`${BASE_URL}/api/community/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPost }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setPosts([data.data, ...posts]);
        setNewPost('');
      } else {
        setError(data.message || 'Failed to post');
      }
    } catch (err) {
      setError('Error posting: ' + err.message);
    }
  };

  const handleContact = (service) => {
    setSelectedService(service);
    // Placeholder for messaging logic; could open a modal or navigate to a chat page
    alert(`Contacting ${service.name} at ${service.contact}`);
  };

  const filteredServices = filterType === 'all'
    ? services
    : services.filter(service => service.type === filterType);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  return (
    <section className="community-page">
      <h1 className="community-title">FixMyRide Community</h1>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-spinner">Loading...</div>}

      <div className="community-filters">
        <select value={filterType} onChange={handleFilterChange} className="filter-select">
          <option value="all">All Services</option>
          <option value="car">Car Mechanics</option>
          <option value="bike">Bike Mechanics</option>
          <option value="ev">EV Charging</option>
        </select>
      </div>

      <div className="community-content">
        <div className="services-section">
          <h2>Available Services</h2>
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <motion.div
                key={service.id}
                className="service-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3>{service.name}</h3>
                <p>Type: {service.type}</p>
                <p>Location: {service.location}</p>
                <p>Contact: {service.contact}</p>
                <button
                  className="contact-btn"
                  onClick={() => handleContact(service)}
                >
                  <FaComment /> Contact
                </button>
                {GOOGLE_MAPS_API_KEY && (
                  <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                    <div className="service-map">
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={{ lat: service.latitude, lng: service.longitude }}
                        zoom={13}
                      >
                        <Marker position={{ lat: service.latitude, lng: service.longitude }} />
                      </GoogleMap>
                    </div>
                  </LoadScript>
                )}
              </motion.div>
            ))
          ) : (
            <p>No services available for the selected filter.</p>
          )}
        </div>

        <div className="community-feed">
          <h2>Community Feed</h2>
          <form onSubmit={handlePostSubmit} className="post-form">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Post a help request or update (e.g., 'Stranded on Highway 101, need a mechanic')..."
              className="post-input"
            />
            <button type="submit" className="post-btn" disabled={!user}>
              <FaPlus /> Post
            </button>
          </form>
          {posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                key={post.id}
                className="post-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p><strong>{post.user?.name || 'Anonymous'}:</strong> {post.content}</p>
                <small>{new Date(post.createdAt).toLocaleString()}</small>
              </motion.div>
            ))
          ) : (
            <p>No posts yet. Be the first to ask for help!</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommunityPage;