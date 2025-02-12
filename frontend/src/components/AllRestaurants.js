// src/components/AllRestaurants.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
      <div className="text-center">
      <h2>All Restaurants</h2>
      <ul className="list-unstyled">
        {restaurants.map((restaurant) => (
          <li key={restaurant._id} className="mb-2">
            <Link
              to={`/restaurant/${encodeURIComponent(restaurant.name)}`}
              className="btn btn-secondary"
            >
              {restaurant.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllRestaurants;