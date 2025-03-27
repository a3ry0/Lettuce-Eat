// src/components/HealthRating.js
import React, { useState, useEffect } from 'react';

const HealthRating = ({ restaurantName }) => {
  const [healthRating, setHealthRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantName) return;
    
    const fetchHealthRating = async () => {
      setLoading(true);
      try {
        // First try to get specific restaurant rating
        const response = await fetch(`http://localhost:8000/api/restaurants/${encodeURIComponent(restaurantName)}/rating`);
        
        if (!response.ok) {
          // If specific endpoint fails, try to find in all restaurants
          const allResponse = await fetch('http://localhost:8000/api/restaurants');
          if (!allResponse.ok) {
            throw new Error('Failed to fetch health rating');
          }
          
          const allData = await allResponse.json();
          const restaurant = allData.find(r => 
            r.name.toLowerCase() === restaurantName.toLowerCase()
          );
          
          if (restaurant) {
            setHealthRating(restaurant.healthRating);
          } else {
            setHealthRating(null);
          }
        } else {
          const data = await response.json();
          setHealthRating(data.healthRating);
        }
      } catch (err) {
        console.error('Error fetching health rating:', err);
        setError('Could not load health rating');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRating();
  }, [restaurantName]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-success">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-warning">★</span>);
      } else {
        stars.push(<span key={i} className="text-secondary">☆</span>);
      }
    }
    
    return stars;
  };

  const getHealthLabel = (rating) => {
    if (rating >= 4) return 'Very Healthy';
    if (rating >= 3) return 'Moderately Healthy';
    if (rating >= 2) return 'Less Healthy';
    return 'Unhealthy';
  };

  if (loading) return <div>Loading health rating...</div>;
  if (error) return <div className="text-muted">Health rating unavailable</div>;
  if (!healthRating) return <div className="text-muted">No health data available</div>;

  return (
    <div className="health-rating my-2 p-2 border rounded">
      <h5>Health Rating</h5>
      <div className="d-flex align-items-center">
        <div className="me-2">
          {renderStars(healthRating)}
        </div>
        <div>
          <span className="badge bg-info">{healthRating.toFixed(1)}/5</span>
          {' '}
          <span className={healthRating >= 3 ? 'text-success' : 'text-danger'}>
            {getHealthLabel(healthRating)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HealthRating;