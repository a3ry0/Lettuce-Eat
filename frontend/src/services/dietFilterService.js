// src/services/dietFilterService.js

const DIET_API_URL = "http://localhost:6001/api/diets";

export const getDietTypes = async () => {
  try {
    const response = await fetch(DIET_API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch diet types");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching diet types:", error);
    return [];
  }
};

export const filterMenuItemsByDiet = async (dietType, menuItems) => {
  try {
    const response = await fetch(`${DIET_API_URL}/filter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dietType, menuItems }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to filter menu items");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error filtering menu items:", error);
    return { items: [] };
  }
};