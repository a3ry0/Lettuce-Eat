// src/components/RestaurantSearch.js
import React, { useState } from "react";

const RestaurantSearch = ({ onSelectRestaurant }) => {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/restaurants?search=${encodeURIComponent(search)}`
      );
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

  return (
    <div className="text-center">
      <h2 className="mb-4">
        Quickly find a healthier dining option by searching for a restaurant or browsing the full list.
      </h2>
      {/* Centered input group */}
      <div className="d-flex justify-content-center mb-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter restaurant name"
          className="form-control me-2"
          style={{ maxWidth: "400px" }}
        />
        <button onClick={handleSearch} className="btn btn-secondary">
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-unstyled">
        {restaurants.map((restaurant) => (
          <li
            key={restaurant._id}
            onClick={() => onSelectRestaurant(restaurant)}
            style={{ cursor: "pointer" }}
          >
            <strong>{restaurant.name}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantSearch;