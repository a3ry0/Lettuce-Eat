// src/components/DietFilter.js
import React, { useState, useEffect } from "react";
import { getDietTypes, filterMenuItemsByDiet } from "../services/dietFilterService";

const DietFilter = ({ menuItems, onFilteredMenuChange }) => {
  const [dietTypes, setDietTypes] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDietTypes = async () => {
      try {
        const types = await getDietTypes();
        setDietTypes(types);
      } catch (err) {
        setError("Failed to load diet types");
        console.error(err);
      }
    };

    fetchDietTypes();
  }, []);

  const handleDietChange = async (event) => {
    const dietType = event.target.value;
    setSelectedDiet(dietType);
    
    if (!dietType) {
      // If no diet is selected, show all items
      onFilteredMenuChange(menuItems);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await filterMenuItemsByDiet(dietType, menuItems);
      onFilteredMenuChange(result.items);
    } catch (err) {
      setError("Failed to filter menu items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diet-filter mb-4">
      <div className="form-group">
        <label htmlFor="diet-select">Filter by dietary preference:</label>
        <select
          id="diet-select"
          className="form-control"
          value={selectedDiet}
          onChange={handleDietChange}
        >
          <option value="">All Items</option>
          {dietTypes.map((diet) => (
            <option key={diet.id} value={diet.id}>
              {diet.name} - {diet.description}
            </option>
          ))}
        </select>
      </div>
      
      {loading && <p>Filtering items...</p>}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

export default DietFilter;