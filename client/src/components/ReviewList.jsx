import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_API_URL}/reviews`)
    .then((res) => setReviews(res.data))
    .catch((err) => console.error("Error fetching reviews:", err));
}, []);


  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Review History</h2>
      {reviews.length === 0 ? (
        <p>No reviews submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review._id} className="p-4 border rounded shadow">
              <p>
                <strong>Review:</strong> {review.text}
              </p>
              <p>
                <strong>Sentiment:</strong> {review.sentiment}
              </p>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(review.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;
