import React, { useState } from "react";
import "./Modal.css";
import { useNavigate } from "react-router-dom";

export default function Modal({ topic, onClose }) {
  const [level, setLevel] = useState("beginner");
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(`/quiz/${topic.id}?level=${level}`);

    onClose();
  };

  const statsKey = `stats_${topic.title}`;
  const stats = JSON.parse(localStorage.getItem(statsKey)) || {
    bestTime: null,
    attempts: 0,
    lastAttempt: null,
  };

  function formatDate(dateString) {
    if (!dateString) return "—";
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  }

  function formatTime(seconds) {
    if (seconds == null) return "—";
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="overlay">
      <div className="window">
        <div className="header">
          <span className="title">{topic.title}</span>
          <button className="close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="body">
          <p className="paragraph">
            <strong>Preview:</strong> {topic.preview}
          </p>
          <p className="paragraph">
            <strong>🔧 Commands included:</strong> {topic.commands}
          </p>
          <p className="paragraph" style={{ marginBottom: ".25rem" }}>
            <strong>📋 Difficulty:</strong>
          </p>
          <div className="levelRow">
            {["beginner", "intermediate", "advanced"].map((lvl) => (
              <label key={lvl} className="levelLabel">
                <input
                  type="radio"
                  name="level"
                  value={lvl}
                  checked={level === lvl}
                  onChange={() => setLevel(lvl)}
                />
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </label>
            ))}
          </div>
          <p className="paragraph" style={{ marginTop: ".75rem" }}>
            <strong>📊 Progress:</strong>{" "}
            {"★".repeat(topic.stars) + "☆".repeat(5 - topic.stars)}
          </p>
          <p className="stats">
            Last attempt: {formatDate(stats.lastAttempt)} | Time:{" "}
            {formatTime(stats.bestTime)} | Attempts:{stats.attempts}
          </p>
        </div>
        <button className="start" onClick={handleStart}>
          START
        </button>
      </div>
    </div>
  );
}
