// client/src/components/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // for routing to results

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) {
      setError("Please enter a review.");
      return;
    }
    try {
      // Send review to backend /analyze endpoint
      //   const response = await axios.post("http://localhost:3001/analyze", {
      //     review,
      //   });

      const response = await axios.post("/analyze", { review });

      const { sentiment, explanation } = response.data;
      // Pass the data via state to Results page
      navigate("/results", { state: { sentiment, explanation, review } });
    } catch (err) {
      console.error(err);
      setError("Error analyzing sentiment.");
    }
  };

  return (
    <div className="container">
      <h2>Movie Review Sentiment Analyzer</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          placeholder="Enter a movie review..."
          value={review}
          onChange={(e) => {
            setReview(e.target.value);
            setError("");
          }}
        />
        <button type="submit">Analyze</button>
        <Link to="/reviews" className="text-blue-600 underline">
          View Past Reviews
        </Link>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Home;
