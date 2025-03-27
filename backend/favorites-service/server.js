// favorites-service/server.js
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const PORT = process.env.FAVORITES_PORT || 5001;

app.use(cors());
app.use(express.json());

console.log("MongoDB URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create a Favorite schema and model
const favoriteSchema = new mongoose.Schema({
  restaurantName: String,
  item: {
    name: String,
    calories: Number,
    ingredients: String,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

// Get all favorites
app.get('/api/favorites', async (req, res) => {
  try {
    const favorites = await Favorite.find().sort({ createdAt: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a favorite
app.post('/api/favorites', async (req, res) => {
  try {
    const favorite = new Favorite({
      ...req.body
    });
    
    const newFavorite = await favorite.save();
    res.status(201).json(newFavorite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a favorite
app.delete('/api/favorites/:id', async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    res.json(favorite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear all favorites (optional)
app.delete('/api/favorites', async (req, res) => {
  try {
    await Favorite.deleteMany({});
    res.json({ message: 'All favorites cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Favorites Microservice running on port ${PORT}`);
});