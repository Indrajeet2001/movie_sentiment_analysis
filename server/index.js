// server/index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Review = require("./models/Review"); // optional

dotenv.config();

// to check if the uri is loaded
console.log("MONGO URI:", process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple word lists
const positiveWords = ["good", "great", "amazing", "awesome", "excellent"];
const negativeWords = ["bad", "terrible", "awful", "boring", "poor"];

// Connect MongoDB (optional)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// POST /analyze
app.post("/analyze", async (req, res) => {
  const review = req.body.review || "";
  const words = review.toLowerCase().split(/\W+/);

  let posCount = 0,
    negCount = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (positiveWords.includes(word)) posCount++;
    if (negativeWords.includes(word)) negCount++;

    // Handle negation (e.g., "not good" → negative)
    if (word === "not" && i + 1 < words.length) {
      const next = words[i + 1];
      if (positiveWords.includes(next)) {
        negCount++;
        i++; // skip next
      } else if (negativeWords.includes(next)) {
        posCount++;
        i++;
      }
    }
  }

  app.get("/reviews", async (req, res) => {
    try {
      const reviews = await Review.find().sort({ createdAt: -1 });
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  let sentiment = "Neutral";
  if (posCount > negCount) sentiment = "Positive";
  else if (negCount > posCount) sentiment = "Negative";

  const explanation = `Review has ${posCount} positive word(s) and ${negCount} negative word(s).`;

  // Save to DB (optional)
  const reviewDoc = new Review({
    text: review,
    sentiment,
    createdAt: new Date(),
  });
  await reviewDoc.save();

  res.json({ sentiment, explanation });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
