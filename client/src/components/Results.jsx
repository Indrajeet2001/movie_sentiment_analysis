import React from "react";
import { useLocation, Link } from "react-router-dom";

function Results() {
  const { state } = useLocation();
  if (!state) {
    return <p>No data to display. Go back and enter a review.</p>;
  }
  const { sentiment, explanation, review } = state;

  return (
    <div className="container">
      <h2>Sentiment Result</h2>
      <p>
        <strong>Review:</strong> {review}
      </p>
      <p>
        <strong>Sentiment:</strong> {sentiment}
      </p>
      <p>
        <strong>Explanation:</strong> {explanation}
      </p>
      <Link to="/">Analyze another review</Link>
    </div>
  );
}

export default Results;
