// src/components/RestaurantDetails.js
import React, { useState, useEffect } from "react";
import { addFavorite } from "../services/favoritesService";
import MenuItem from "./MenuItem";

const RestaurantDetails = ({ restaurantName }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantName) return;
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/api/restaurants/${encodeURIComponent(restaurantName)}/menu`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }
        const data = await response.json();
        setMenu(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantName]);

  const handleAddFavorite = async (item) => {
    const favoriteItem = {
      restaurantName,
      item, // includes details such as name, calories, ingredients, protein, carbs, fats
      createdAt: new Date(),
    };
    try {
      await addFavorite(favoriteItem);
      alert('Item added to favorites!');
    } catch (err) {
      console.error(err);
      alert('Failed to add to favorites');
    }
  };

  return (
    <div>
      <h2>{restaurantName} - Menu</h2>
      {loading && <p>Loading menu...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {menu.length > 0 ? (
          menu.map((item, index) => (
            <MenuItem 
            key={index} 
            item={item} 
            onAction={() => handleAddFavorite(item)} 
            actionLabel="Favorite" 
            />
          ))
        ) : (
          !loading && <p>No menu items available.</p>
        )}
      </ul>
    </div>
  );
};

export default RestaurantDetails;