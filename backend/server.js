const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import the Restaurant model from the models folder
const Restaurant = require('./models/Restaurant');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Default Route - Search Restaurants
app.get("/api/restaurants", async (req, res) => {
    try {
        const { search } = req.query;
        // If a search query exists, perform a case-insensitive search on the name field
        const query = search ? { name: new RegExp(search, "i") } : {};
        
        // Optionally, select only certain fields (e.g., name) if desired:
        // const restaurants = await Restaurant.find(query).select("name");

        const restaurants = await Restaurant.find(query);
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurants", error });
    }
});

// Get Menu Items for a Restaurant
app.get('/api/restaurants/:name/menu', async (req, res) => {
    try {
        const restaurantName = req.params.name;
        const restaurant = await Restaurant.findOne({ name: restaurantName });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Return the full menu of the restaurant.
        res.json(restaurant.menu);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));