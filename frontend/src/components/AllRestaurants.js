// src/components/AllRestaurants.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [healthRatings, setHealthRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/restaurants");
        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }
        const data = await response.json();
        setRestaurants(data);
        
        // Fetch health ratings from the microservice
        try {
          const healthResponse = await fetch("http://localhost:3000/api/restaurants");
          if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            const ratings = {};
            healthData.forEach(r => {
              ratings[r.name] = r.healthRating;
            });
            setHealthRatings(ratings);
          }
        } catch (healthErr) {
          console.error("Could not fetch health ratings:", healthErr);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const renderHealthBadge = (restaurantName) => {
    const rating = healthRatings[restaurantName];
    if (!rating) return null;
    
    let badgeClass = "badge ";
    if (rating >= 4) badgeClass += "bg-success";
    else if (rating >= 3) badgeClass += "bg-info";
    else if (rating >= 2) badgeClass += "bg-warning";
    else badgeClass += "bg-danger";
    
    return (
      <span className={badgeClass} style={{ marginLeft: '8px' }}>
        {rating.toFixed(1)}/5
      </span>
    );
  };

  return (
    <div className="text-center">
      <h2>All Restaurants</h2>
      {loading && <p>Loading restaurants...</p>}
      {error && <p className="text-danger">{error}</p>}
      <div className="row justify-content-center">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  {restaurant.name}
                  {renderHealthBadge(restaurant.name)}
                </h5>
                <Link
                  to={`/restaurant/${encodeURIComponent(restaurant.name)}`}
                  className="btn btn-primary"
                >
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllRestaurants;