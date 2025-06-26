const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Review = require("./models/Review");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple word lists
const positiveWords = [
  "good", "great", "amazing", "awesome", "excellent", "fantastic", "wonderful", "brilliant",
  "outstanding", "superb", "enjoyable", "delightful", "impressive", "incredible", "thrilling",
  "emotional", "heartwarming", "inspiring", "fun", "beautiful", "touching", "powerful",
  "hilarious", "entertaining", "masterpiece", "perfect", "creative", "well-made", "solid",
  "strong", "smart", "engaging", "captivating", "charming", "epic"
];
const negativeWords = [
  "bad", "terrible", "awful", "boring", "poor", "dull", "predictable", "disappointing",
  "slow", "weak", "annoying", "painful", "unwatchable", "forgettable", "mediocre", "waste",
  "ridiculous", "flat", "uninspired", "overrated", "confusing", "cringeworthy", "cliché",
  "messy", "horrible", "nonsense", "meaningless", "pointless", "underwhelming", "lame",
  "unrealistic", "monotonous", "inconsistent", "badly-written", "cheesy"
];

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

  let sentiment = "Neutral";
  if (posCount > negCount) sentiment = "Positive";
  else if (negCount > posCount) sentiment = "Negative";

  const explanation = `Review has ${posCount} positive word(s) and ${negCount} negative word(s).`;

  // Save to DB
  const reviewDoc = new Review({
    text: review,
    sentiment,
    createdAt: new Date(),
  });
  await reviewDoc.save();

  res.json({ sentiment, explanation });
});

app.get("/reviews", async (req, res) => {
    try {
      const reviews = await Review.find().sort({ createdAt: -1 });
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
