// community-submissions-service/server.js
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
console.log("MongoDB URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.SUBMISSIONS_PORT || 7001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define Submission Schema
const submissionSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  restaurantName: { type: String, required: true },
  item: {
    name: { type: String, required: true },
    calories: Number,
    ingredients: String,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  submitterInfo: {
    name: { type: String, default: "Anonymous" }
  },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create Submission Model
const Submission = mongoose.model("Submission", submissionSchema);

app.use(cors());
app.use(express.json());

// Get all submissions (optionally filter by status)
app.get("/api/submissions", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const submissions = await Submission.find(filter).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get only approved submissions
app.get("/api/submissions/approved", async (req, res) => {
  try {
    const submissions = await Submission.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new submission
app.post("/api/submissions", async (req, res) => {
  try {
    const { restaurantName, item, submitterInfo } = req.body;
    if (!restaurantName || !item || !item.name) {
      return res.status(400).json({ message: "Invalid submission. Required: restaurantName, item with name." });
    }

    const submission = new Submission({
      restaurantName,
      item,
      submitterInfo: submitterInfo || { name: "Anonymous" },
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update submission status (approve/reject)
app.patch("/api/submissions/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be: pending, approved, or rejected." });
    }

    const submission = await Submission.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a submission
app.delete("/api/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findByIdAndDelete(id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Community Submissions Microservice running on port ${PORT}`);
});