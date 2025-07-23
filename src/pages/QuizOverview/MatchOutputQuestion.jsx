import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import "../../index.css";
import { OptionCard, DropZone } from "./DragComponents";

function MatchOutputQuestion({
  question,
  onNext,
  onBack,
  isFirst,
  savedState,
  setQuestionState,
}) {
  const [userAnswers, setUserAnswers] = useState(savedState?.userAnswers || {});
  const [shuffledOptions, setShuffledOptions] = useState(
    savedState?.shuffledOptions || []
  );
  const [submitted, setSubmitted] = useState(savedState?.submitted || false);
  const [showFeedback, setShowFeedback] = useState(
    savedState?.showFeedback || false
  );
  const [isCorrect, setIsCorrect] = useState(savedState?.isCorrect || false);

  useEffect(() => {
    if (
      !savedState ||
      !savedState.shuffledOptions ||
      savedState.shuffledOptions.length === 0
    ) {
      const shuffled = [...question.options].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
      setUserAnswers({});
      setSubmitted(false);
      setShowFeedback(false);
      setIsCorrect(false);

      setQuestionState({
        userAnswers: {},
        submitted: false,
        showFeedback: false,
        isCorrect: false,
        shuffledOptions: shuffled,
      });
    } else {
      setUserAnswers(savedState.userAnswers || {});
      setSubmitted(savedState.submitted || false);
      setShowFeedback(savedState.showFeedback || false);
      setIsCorrect(savedState.isCorrect || false);
      setShuffledOptions(savedState.shuffledOptions);
    }
  }, [question]); // <-- реагируем на смену вопроса

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
      const correct = question.blocks.every(
        (block) => userAnswers[block.id] === block.correctCommand
      );

      setSubmitted(true);
      setShowFeedback(true);
      setIsCorrect(correct);

      setQuestionState({
        userAnswers,
        submitted: true,
        shuffledOptions,
        showFeedback: true,
        isCorrect: correct,
      });
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

        {!submitted && (
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
        )}

        {submitted && (
          <div className="feedback-box">
            <p className="feedback-text">
              {isCorrect
                ? "✅ Well done! You got all answers correct."
                : "❌ Not quite, some commands were incorrect."}
            </p>
            <p className="feedback-score">
              Correct answers:{" "}
              {
                question.blocks.filter(
                  (block) => userAnswers[block.id] === block.correctCommand
                ).length
              }
              /{question.blocks.length}
            </p>
          </div>
        )}

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
