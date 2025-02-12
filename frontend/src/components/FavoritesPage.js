// src/components/FavoritesPage.js
import React, { useState, useEffect } from "react";
import { getFavorites, removeFavorite } from "../services/favoritesService";
import MenuItem from "./MenuItem";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await removeFavorite(favoriteId);
      // Update the favorites state after removal.
      setFavorites(favorites.filter((fav) => fav._id !== favoriteId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove favorite");
    }
  };

  return (
    <div>
      <h2>Favorites</h2>
      {loading && <p>Loading favorites...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {favorites.length > 0 ? (
          favorites.map((fav) => (
            <MenuItem
              key={fav._id}
              item={fav.item}
              restaurantName={fav.restaurantName}
              onAction={() => {
                if (
                  window.confirm(
                    "Are you sure you want to remove this favorite? This means it won't be saved for later."
                  )
                ) {
                  handleRemoveFavorite(fav._id);
                }
              }}
              actionLabel="Remove"
              actionClass="btn btn-danger"
            />
          ))
        ) : (
          !loading && <p>No favorites added.</p>
        )}
      </ul>
    </div>
  );
};

export default FavoritesPage;