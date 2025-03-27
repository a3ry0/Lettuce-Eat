// seed.js
const mongoose = require("mongoose");
require("dotenv").config();

const Restaurant = require("./models/Restaurant");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    const sampleRestaurants = [
      
      {
        name: "Chilli's",
        healthRating: 3.5,
        menu: [
          {
            name: "Ancho Salmon",
            calories: 630,
            ingredients: "Seared chile-rubbed Atlantic salmon, cilantro pesto, and cilantros. Served with Mexican rice and steamed broccoli.",
            protein: 48,
            carbs: 41,
            fats: 32
          },
          {
            name: "Margarita Grilled Chicken",
            calories: 630,
            ingredients: "Grilled Chicken, pico, tortilla strips, Mexican rice, black beans.",
            protein: 55,
            carbs: 68,
            fats: 17
          }
        ],
      },
      {
        name: "Jack in The Box",
        healthRating: 2.7,
        menu: [
          {
            name: "Chicken Fajita Pita",
            calories: 320,
            ingredients: "Grilled chicken strips, shredded cheddar cheese, lettuce, grilled onions & tomato in whole grain pita bread",
            protein: 24,
            carbs: 33,
            fats: 11
          },
          {
            name: "Grilled Chicken Caesar Jack Wrap",
            calories: 340,
            ingredients: "Grilled white meat chicken strips, shredded lettuce, tomato & Caesar dressing wrapped up in a tortilla.",
            protein: 23,
            carbs: 30,
            fats: 11
          }
        ],
      },
      {
        name: "Panda Express",
        healthRating: 2.8,
        menu: [
          {
            name: "Teriyaki Chicken Bowl",
            calories: 510,
            ingredients: "Grilled chicken served with teriyaki sauce, 1/2 super greens (broccoli, kale, and cabbage), and 1/2 white steamed rice rice.",
            protein: 11,
            carbs: 62,
            fats: 32
          },
          {
            name: "Broccoli Beef Bowl",
            calories: 530,
            ingredients: "Tender beef and broccoli in a ginger soy sauce, and white steamed rice.",
            protein: 16,
            carbs: 100,
            fats: 7
          }
        ],
      },
      {
        name: "Taco Bell",
        healthRating: 2.2,
        menu: [
          {
            name: "Cantina Chicken Bowl",
            calories: 490,
            ingredients: "Slow-roasted chicken, seasoned rice, black beans, Avocado Ranch sauce, reduced-fat sour cream, lettuce, shredded purple cabbage, pico de gallo, guacamole, and cheddar cheese.",
            protein: 25,
            carbs: 44,
            fats: 24
          },
          {
            name: "Burrito Supreme",
            calories: 380,
            ingredients: "Choice of seasoned beef, steak, or chicken with refried beans, red sauce, lettuce, real cheddar cheese, diced onions, tomatoes, and reduced fat sour cream.",
            protein: 19,
            carbs: 49,
            fats: 12
          }
        ],
      },
      {
        name: "Starbucks",
        healthRating: 4.1,
        menu: [
          {
            name: "Spinach, Feta & Egg White Wrap",
            calories: 290,
            ingredients: "Cage-free egg whites are combined with spinach, feta cheese and sun-dried tomato cream cheese inside a whole-wheat wrap.",
            protein: 20,
            carbs: 34,
            fats: 8
          },
          {
            name: "Turkey Bacon, Cheddar & Egg White Sandwich",
            calories: 230,
            ingredients: "Turkey bacon and cage-free egg whites paired with creamy, melted, reduced-fat white Cheddar cheese on a wheat English muffin.",
            protein: 17,
            carbs: 28,
            fats: 5
          }
        ],
      },
    ];

    return Restaurant.insertMany(sampleRestaurants);
  })
  .then((docs) => {
    console.log("Sample restaurants inserted:", docs);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
    mongoose.connection.close();
  });
