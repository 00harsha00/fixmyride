import { useState, useCallback } from 'react';
import getLocationAndSend from '../utils/getLocation';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; // Default to local server if not set
const useNearbyPlaces = (baseUrl) => {
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNearbyPlaces = useCallback(async (placeType) => {
        setLoading(true);
        setError(null);
        try {
            getLocationAndSend(
                async (data) => {
                    const { latitude, longitude } = data;
                    const response = await fetch(
                        `${BASE_URL}/api/nearby?latitude=${latitude}&longitude=${longitude}&type=${placeType}`
                    );
                    const nearbyData = await response.json();
                    if (nearbyData.status === 'success' && Array.isArray(nearbyData.data)) {
                        const validPlaces = nearbyData.data.filter(
                            (place) =>
                                place &&
                                place.id &&
                                place.name &&
                                typeof place.latitude === 'number' &&
                                typeof place.longitude === 'number'
                        );
                        setNearbyPlaces(validPlaces);
                        if (validPlaces.length === 0) {
                            setError('No valid places found nearby.');
                        }
                    } else {
                        setError(nearbyData.message || 'Failed to fetch nearby places');
                        setNearbyPlaces([]);
                    }
                    setLoading(false);
                },
                (error) => {
                    setError(error);
                    setLoading(false);
                    setNearbyPlaces([]);
                }
            );
        } catch (err) {
            setError('Error fetching nearby places: ' + err.message);
            setLoading(false);
            setNearbyPlaces([]);
        }
    }, [baseUrl]);

    return { nearbyPlaces, loading, error, fetchNearbyPlaces };
};

export default useNearbyPlaces;