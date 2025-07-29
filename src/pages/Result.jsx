import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Result = ({
  correctAnswers,
  totalQuestions,
  topicName,
  onRetry,
  elapsedSeconds,
}) => {
  const stars = Math.round((correctAnswers / totalQuestions) * 5);
  const navigate = useNavigate();

  useEffect(() => {
    if (!topicName) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Kein Token vorhanden - Ergebnis wird nicht gespeichert.");
      return;
    }

    let email;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      email = payload.email;
    } catch (err) {
      console.error("Ungültiger Token:", err);
      return;
    }

    const resultData = {
      email,
      topic: topicName,
      stars,
      correctAnswers,
      totalQuestions,
      elapsedSeconds,
      badge: "Fast Finisher",
    };

    fetch("http://localhost:3001/save-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(resultData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Speichern");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Ergebnis gespeichert:", data);

        const key = `stats_${topicName}`;
        const prev = JSON.parse(localStorage.getItem(key)) || {
          bestTime: null,
          attempts: 0,
          lastAttempt: null,
        };

        const newStats = {
          bestTime:
            prev.bestTime === null || elapsedSeconds < prev.bestTime
              ? elapsedSeconds
              : prev.bestTime,
          attempts: prev.attempts + 1,
          lastAttempt: new Date().toISOString(),
        };

        localStorage.setItem(key, JSON.stringify(newStats));
      })

      .catch((err) => {
        console.error("Fehler beim Speichern des Ergebnisses:", err);
      });
  }, [stars, topicName, correctAnswers, totalQuestions, elapsedSeconds]);

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

        <p className="result-line">Time: {formatTime(elapsedSeconds)}</p>

        <p className="result-line">Difficulty:</p>
        <p className="result-line">Attempts:</p>
        <p className="result-line">
          Correct answers: {correctAnswers}/{totalQuestions}
        </p>
        <div className="result-buttons">
          <button onClick={onRetry}>Try Again</button>
          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => navigate("/quiz/2")}>Next</button>
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default Result;
