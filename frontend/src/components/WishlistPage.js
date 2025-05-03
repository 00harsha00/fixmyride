import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/WishlistPage.css';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;


const WishlistPage = () => {
  const { token } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.status === 'success') {
          setWishlist(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setWishlist(wishlist.filter(item => item.productId._id !== productId));
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="wishlist-page">
      <h2>Your Wishlist</h2>
      {wishlist.length > 0 ? (
        <div className="wishlist-items">
          {wishlist.map((item) => (
            <div key={item._id} className="wishlist-item">
              <img src={item.productId.imageUrl} alt={item.productId.name} />
              <div className="wishlist-item-details">
                <h3>{item.productId.name}</h3>
                <p>Price: ${item.productId.discountedPrice.toFixed(2)}</p>
                <button className="remove-btn" onClick={() => removeFromWishlist(item.productId._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default WishlistPage;