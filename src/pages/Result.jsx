import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Result = ({ correctAnswers, totalQuestions, topicName, onRetry }) => {
  const stars = Math.round((correctAnswers / totalQuestions) * 5);
  const navigate = useNavigate();

  useEffect(() => {
    if (topicName) {
      const progress = JSON.parse(localStorage.getItem("quizProgress")) || {};
      progress[topicName] = stars;
      localStorage.setItem("quizProgress", JSON.stringify(progress));
    }
  }, [stars, topicName]);

  return (
    <div>
      <div className="top-bar">
        <div className="logo">QUIZZLER</div>
        {/* <div className="user-badge">User</div> */}
      </div>

      <div className="result-page">
        <h1>Well Done, User</h1>
        <p className="result-line">Quiz: {topicName}</p>
        <p className="result-line">
          Score:{" "}
          <span className="stars">
            {"★".repeat(stars)}
            {"☆".repeat(5 - stars)}
          </span>
        </p>

        <p className="result-line">Time:</p>
        <p className="result-line">Difficulty:</p>
        <p className="result-line">Attempts:</p>
        <p className="result-line">
          Correct answers: {correctAnswers}/{totalQuestions}
        </p>
        <div className="result-buttons">
          <button onClick={onRetry}>Try Again</button>
          <button onClick={() => navigate("/home")}>Home</button>
          <button onclick={() => navigate("/quiz/2")}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Result;
