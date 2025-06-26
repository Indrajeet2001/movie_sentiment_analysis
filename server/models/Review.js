// server/models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sentiment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
