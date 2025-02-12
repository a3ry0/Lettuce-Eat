// src/services/favoritesService.js

const USE_DUMMY_FAVORITES = true;
const DUMMY_KEY = "dummyFavorites";

// Helper function to get favorites from localStorage
const getStoredFavorites = () => {
  const data = localStorage.getItem(DUMMY_KEY);
  return data ? JSON.parse(data) : [];
};

// Helper function to save favorites to localStorage
const saveFavorites = (favorites) => {
  localStorage.setItem(DUMMY_KEY, JSON.stringify(favorites));
};

export const getFavorites = async () => {
  if (USE_DUMMY_FAVORITES) {
    // Return favorites stored in localStorage
    return getStoredFavorites();
  }
  // For a real microservice, use the fetch call below:
  const response = await fetch("http://localhost:5001/api/favorites");
  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }
  return response.json();
};

export const addFavorite = async (favoriteItem) => {
  if (USE_DUMMY_FAVORITES) {
    // Get current favorites from localStorage
    const currentFavorites = getStoredFavorites();
    // Create a dummy _id using timestamp (or any unique string)
    const newItem = { ...favoriteItem, _id: Date.now().toString() };
    currentFavorites.push(newItem);
    saveFavorites(currentFavorites);
    return newItem;
  }
  // For a real microservice, use the fetch call below:
  const response = await fetch("http://localhost:5001/api/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(favoriteItem),
  });
  if (!response.ok) {
    throw new Error("Failed to add favorite");
  }
  return response.json();
};

export const removeFavorite = async (id) => {
  if (USE_DUMMY_FAVORITES) {
    const currentFavorites = getStoredFavorites();
    const newFavorites = currentFavorites.filter((fav) => fav._id !== id);
    saveFavorites(newFavorites);
    return Promise.resolve({ _id: id });
  }
  // For a real microservice, use the fetch call below:
  const response = await fetch(`http://localhost:5001/api/favorites/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to remove favorite");
  }
  return response.json();
};
