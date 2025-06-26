# 🎬 Sentiment Analysis Tool — MERN Stack

This is an AI-powered sentiment analysis web application for movie reviews. Built using the MERN stack (MongoDB, Express, React, Node.js), it analyzes whether a given review is **Positive**, **Negative**, or **Neutral** using a rule-based approach.

---

## 🔧 Features

- ✅ Input movie reviews via a user-friendly frontend
- ✅ Backend processes reviews using a word-based sentiment algorithm
- ✅ Sentiment result with a simple explanation is displayed
- ✅ Reviews are stored in MongoDB with timestamps
- ✅ Past reviews can be viewed in a history page

---

## 🧠 Sentiment Analysis Approach

The backend checks for:
- A list of **positive words** (`good`, `great`, `amazing`, etc.)
- A list of **negative words** (`bad`, `boring`, `poor`, etc.)
- Special handling for **negations** (e.g., `"not good"` = negative)

The sentiment is decided based on word counts:
- **Positive > Negative** → `Positive`
- **Negative > Positive** → `Negative`
- **Equal** → `Neutral`

---

## 🖥️ How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mern-sentiment-analysis.git
cd mern-sentiment-analysis
