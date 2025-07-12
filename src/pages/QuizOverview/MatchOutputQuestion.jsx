import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import "../../index.css";
import { OptionCard, DropZone } from "./DragComponents";

function MatchOutputQuestion({ question, onNext, onBack, isFirst }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setUserAnswers({});
    setSubmitted(false);
    const shuffled = [...question.options].sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffled);
  }, [question]);

  const handleDrop = (event) => {
    if (submitted) return;
    const dragged = event.active.id;
    const target = event.over?.id;
    if (!target || !dragged) return;

    setUserAnswers((prev) => ({
      ...prev,
      [target]: dragged,
    }));
  };

  const allFilled = question.blocks.every((block) => userAnswers[block.id]);

  const handleSubmit = () => {
    if (!submitted && allFilled) {
      setSubmitted(true);
    } else if (submitted) {
      onNext?.();
    }
  };

  return (
    <DndContext onDragEnd={handleDrop}>
      <div className="quiz-question">
        <h2>Match output to its command</h2>

        <div className="terminal-blocks">
          {question.blocks.map((block) => {
            const isCorrect =
              submitted && userAnswers[block.id] === block.correctCommand;
            const isIncorrect =
              submitted && userAnswers[block.id] && !isCorrect;

            return (
              <div
                key={block.id}
                className={`terminal-window ${isCorrect ? "correct" : ""} ${
                  isIncorrect ? "incorrect" : ""
                }`}
              >
                <div className="command-line">{block.prompt}</div>

                <pre className="output">{block.output}</pre>

                <DropZone
                  id={block.id}
                  value={userAnswers[block.id]}
                  correctAnswer={block.correctCommand}
                  showFeedback={submitted}
                  onClear={() => {
                    if (!submitted) {
                      setUserAnswers((prev) => {
                        const updated = { ...prev };
                        delete updated[block.id];
                        return updated;
                      });
                    }
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="instruction-box">
          <p className="instruction-text">{question.instruction}</p>
          <div className="options-wrapper">
            {shuffledOptions
              .filter((opt) => !Object.values(userAnswers).includes(opt))
              .map((opt) => (
                <OptionCard key={opt} id={opt} label={opt} />
              ))}
          </div>
        </div>

        <div className="question-controls">
          <button className="back-button" onClick={onBack} disabled={isFirst}>
            BACK
          </button>

          <button
            className={`submit-button ${submitted ? "success" : ""}`}
            disabled={!allFilled}
            onClick={handleSubmit}
          >
            {submitted ? "NEXT" : "SUBMIT"}
          </button>
        </div>
      </div>
    </DndContext>
  );
}

export default MatchOutputQuestion;
