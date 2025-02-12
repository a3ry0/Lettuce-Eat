const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    menu: [
        {
            name: { type: String, required: true },
            calories: { type: Number, required: true },
            ingredients: { type: String },
            protein: { type: Number },
            carbs: { type: Number },
            fats: { type: Number },
        }
    ]
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);