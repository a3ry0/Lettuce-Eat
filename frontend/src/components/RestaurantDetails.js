// src/components/RestaurantDetails.js
import React, { useState, useEffect } from "react";
import { addFavorite } from "../services/favoritesService";
import MenuItem from "./MenuItem";
import HealthRating from "./HealthRating";
import DietFilter from "./DietFilter";

const RestaurantDetails = ({ restaurantName }) => {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
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
        setFilteredMenu(data); // Initialize filtered menu with all items
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

  // Handle filtered menu updates from DietFilter component
  const handleFilteredMenuChange = (filteredItems) => {
    setFilteredMenu(filteredItems);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{restaurantName} - Menu</h2>
        <HealthRating restaurantName={restaurantName} />
      </div>
      
      <DietFilter 
        menuItems={menu} 
        onFilteredMenuChange={handleFilteredMenuChange} 
      />
      
      {loading && <p>Loading menu...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div className="mb-3">
        <small className="text-muted">
          {filteredMenu.length} items shown {filteredMenu.length !== menu.length ? `(filtered from ${menu.length} total)` : ''}
        </small>
      </div>
      
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item, index) => (
            <MenuItem 
              key={index} 
              item={item} 
              onAction={() => handleAddFavorite(item)} 
              actionLabel="Favorite" 
            />
          ))
        ) : (
          !loading && <p>No menu items available{menu.length > 0 ? ' for the selected filter.' : '.'}</p>
        )}
      </ul>
    </div>
  );
};

export default RestaurantDetails;