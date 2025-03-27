// diet-filter-service/server.js
const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config({ path: '../.env' });
const PORT = process.env.DIET_PORT || 6001;

app.use(cors());
app.use(express.json());

// Diet type definitions with criteria for filtering menu items
const dietTypes = {
  vegetarian: {
    name: 'Vegetarian',
    description: 'No meat, poultry, or seafood',
    filterFunction: (item) => {
      const ingredients = item.ingredients.toLowerCase();
      const nonVegetarianKeywords = ['beef', 'chicken', 'pork', 'fish', 'seafood', 'meat', 'turkey', 'bacon', 'salmon', 'shrimp'];
      return !nonVegetarianKeywords.some(keyword => ingredients.includes(keyword));
    }
  },
  vegan: {
    name: 'Vegan',
    description: 'No animal products including dairy and eggs',
    filterFunction: (item) => {
      const ingredients = item.ingredients.toLowerCase();
      const nonVeganKeywords = ['beef', 'chicken', 'pork', 'fish', 'seafood', 'meat', 'turkey', 'bacon', 'salmon', 'shrimp', 
                                'cheese', 'milk', 'cream', 'yogurt', 'butter', 'egg', 'honey'];
      return !nonVeganKeywords.some(keyword => ingredients.includes(keyword));
    }
  },
  keto: {
    name: 'Keto',
    description: 'Low carb, high fat',
    filterFunction: (item) => {
      // Keto typically requires carbs under 20-50g and higher fat content
      return item.carbs < 20 && item.fats > 15;
    }
  },
  lowCalorie: {
    name: 'Low Calorie',
    description: 'Under 500 calories',
    filterFunction: (item) => item.calories < 500
  },
  highProtein: {
    name: 'High Protein',
    description: '20g+ of protein',
    filterFunction: (item) => item.protein >= 20
  },
  glutenFree: {
    name: 'Gluten-Free',
    description: 'No gluten-containing ingredients',
    filterFunction: (item) => {
      const ingredients = item.ingredients.toLowerCase();
      const glutenKeywords = ['wheat', 'barley', 'rye', 'bread', 'pasta', 'flour', 'gluten'];
      return !glutenKeywords.some(keyword => ingredients.includes(keyword));
    }
  }
};

// Get all available diet types
app.get('/api/diets', (req, res) => {
  const dietInfo = Object.entries(dietTypes).map(([id, diet]) => ({
    id,
    name: diet.name,
    description: diet.description
  }));
  
  res.json(dietInfo);
});

// Filter menu items by diet type
app.post('/api/diets/filter', (req, res) => {
  const { dietType, menuItems } = req.body;
  
  if (!dietType || !menuItems || !Array.isArray(menuItems)) {
    return res.status(400).json({ 
      message: 'Invalid request. Required: dietType and menuItems array.'
    });
  }
  
  if (!dietTypes[dietType]) {
    return res.status(404).json({ 
      message: `Diet type '${dietType}' not found.`,
      availableDiets: Object.keys(dietTypes)
    });
  }
  
  const filteredItems = menuItems.filter(dietTypes[dietType].filterFunction);
  
  res.json({
    dietType: dietTypes[dietType].name,
    totalItems: menuItems.length,
    matchingItems: filteredItems.length,
    items: filteredItems
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Diet Filter Microservice running on port ${PORT}`);
});