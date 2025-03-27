// health-rating-service/server.js
const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config({ path: '../.env' });
const PORT = process.env.HEALTH_PORT || 8001;

app.use(cors());
app.use(express.json());

// In-memory data store for health ratings
const restaurantRatings = [
  { name: "Chilli's", healthRating: 3.5 },
  { name: "Jack in The Box", healthRating: 2.7 },
  { name: "Panda Express", healthRating: 2.8 },
  { name: "Taco Bell", healthRating: 2.2 },
  { name: "Starbucks", healthRating: 4.1 },
  { name: "Chipotle", healthRating: 4.3 },
  { name: "Sweetgreen", healthRating: 4.8 },
  { name: "McDonald's", healthRating: 2.0 },
  { name: "Subway", healthRating: 3.7 },
  { name: "Panera Bread", healthRating: 3.9 }
];

// Get all restaurant ratings
app.get('/api/restaurants', (req, res) => {
  res.json(restaurantRatings);
});

// Get restaurants with rating above threshold
app.get('/api/restaurants/rating/:threshold', (req, res) => {
  const threshold = parseFloat(req.params.threshold);
  const filteredRestaurants = restaurantRatings.filter(
    restaurant => restaurant.healthRating >= threshold
  );
  res.json(filteredRestaurants);
});

// Get rating for specific restaurant
app.get('/api/restaurants/:name/rating', (req, res) => {
  const restaurantName = req.params.name;
  const restaurant = restaurantRatings.find(
    r => r.name.toLowerCase() === restaurantName.toLowerCase()
  );
  
  if (restaurant) {
    res.json({ name: restaurant.name, healthRating: restaurant.healthRating });
  } else {
    res.status(404).json({ message: 'Restaurant not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Health Ratings Microservice running on port ${PORT}`);
});