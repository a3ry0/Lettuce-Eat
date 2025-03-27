// src/services/favoritesService.js

const USE_DUMMY_FAVORITES = false; // Changed to false to use the microservice
const FAVORITES_API_URL = "http://localhost:5001/api/favorites";

// Helper function to get favorites from localStorage (kept for fallback)
const getStoredFavorites = () => {
  const data = localStorage.getItem("dummyFavorites");
  return data ? JSON.parse(data) : [];
};

// Helper function to save favorites to localStorage (kept for fallback)
const saveFavorites = (favorites) => {
  localStorage.setItem("dummyFavorites", JSON.stringify(favorites));
};

export const getFavorites = async () => {
  if (USE_DUMMY_FAVORITES) {
    // Return favorites stored in localStorage
    return getStoredFavorites();
  }
  
  try {
    const response = await fetch(FAVORITES_API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching favorites:", error);
    // Fallback to localStorage if API fails
    return getStoredFavorites();
  }
};

export const addFavorite = async (favoriteItem) => {
  if (USE_DUMMY_FAVORITES) {
    // Get current favorites from localStorage
    const currentFavorites = getStoredFavorites();
    // Create a dummy _id using timestamp
    const newItem = { ...favoriteItem, _id: Date.now().toString() };
    currentFavorites.push(newItem);
    saveFavorites(currentFavorites);
    return newItem;
  }
  
  try {
    const response = await fetch(FAVORITES_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(favoriteItem),
    });
    if (!response.ok) {
      throw new Error("Failed to add favorite");
    }
    return response.json();
  } catch (error) {
    console.error("Error adding favorite:", error);
    // Fallback to localStorage if API fails
    return addFavorite({ ...favoriteItem, USE_DUMMY_FAVORITES: true });
  }
};

export const removeFavorite = async (id) => {
  if (USE_DUMMY_FAVORITES) {
    const currentFavorites = getStoredFavorites();
    const newFavorites = currentFavorites.filter((fav) => fav._id !== id);
    saveFavorites(newFavorites);
    return Promise.resolve({ _id: id });
  }
  
  try {
    const response = await fetch(`${FAVORITES_API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to remove favorite");
    }
    return response.json();
  } catch (error) {
    console.error("Error removing favorite:", error);
    // Fallback to localStorage if API fails
    const currentFavorites = getStoredFavorites();
    const newFavorites = currentFavorites.filter((fav) => fav._id !== id);
    saveFavorites(newFavorites);
    return Promise.resolve({ _id: id });
  }
};