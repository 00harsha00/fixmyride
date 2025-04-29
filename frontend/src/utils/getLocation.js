const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// src/utils/getLocation.js
const getLocationAndSend = async (onSuccess, onError) => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported by your browser');
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
  
        try {
          // Example API call to send location to the backend
          const response = await fetch('${API_BASE_URL}/location', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              latitude,
              longitude,
              timestamp: new Date().toISOString(),
            }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to send location to the backend');
          }
  
          const data = await response.json();
          onSuccess(data);
        } catch (error) {
          onError(error.message || 'An error occurred while sending location');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            onError('User denied the request for Geolocation');
            break;
          case error.POSITION_UNAVAILABLE:
            onError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            onError('The request to get user location timed out');
            break;
          default:
            onError('An unknown error occurred');
            break;
        }
      }
    );
  };
  
  export default getLocationAndSend;
