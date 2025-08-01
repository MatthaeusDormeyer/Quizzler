import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { OptionCard, DropZone } from "./DragComponents";

function FillInTheBlankQuestion({
  question,
  onNext,
  onBack,
  index,
  isFirst,
  savedState,
  setQuestionState,
}) {
  const [userAnswers, setUserAnswers] = useState(savedState?.userAnswers || {});
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(
    savedState?.showFeedback || false
  );
  const [submitted, setSubmitted] = useState(savedState?.submitted || false);
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
    } else {
      setUserAnswers(savedState.userAnswers || {});
      setSubmitted(savedState.submitted || false);
      setShowFeedback(savedState.showFeedback || false);
      setIsCorrect(savedState.isCorrect || false);
      setShuffledOptions(savedState.shuffledOptions);
    }
  }, [question]);

  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  const handleDrop = (event) => {
    if (submitted) return;
    const dragged = event.active.id;
    const target = event.over?.id;
    if (!target || !dragged) return;

    const blankId = target.replace("blank-", "");
    const alreadyUsed = Object.values(userAnswers).includes(dragged);
    if (alreadyUsed) return;

    setUserAnswers((prev) => ({
      ...prev,
      [blankId]: dragged,
    }));
  };

  const handleClear = (blankId) => {
    if (submitted) return;
    setUserAnswers((prev) => {
      const updated = { ...prev };
      delete updated[blankId];
      return updated;
    });
  };

  const renderTemplate = () => {
    const lines = [];
    let currentLine = [];

    question.templateParts.forEach((part, index) => {
      if (typeof part === "string" && part === "\n") {
        if (currentLine.length > 0) lines.push([...currentLine]);
        currentLine = [];
      } else {
        currentLine.push({ value: part, key: index });
      }
    });

    if (currentLine.length > 0) lines.push([...currentLine]);

    return (
      <div className="quiz-card-multi">
        {lines.map((line, i) => (
          <div className="quiz-card" key={i}>
            {line.map((item, j) => {
              if (typeof item.value === "string") {
                return <span key={j}>{item.value}</span>;
              } else if (item.value.blank) {
                const value = userAnswers[item.value.blank];
                return (
                  <DropZone
                    key={j}
                    blankId={item.value.blank}
                    value={value}
                    onClear={handleClear}
                    correctAnswer={question.answers[item.value.blank]}
                    showFeedback={showFeedback}
                  />
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    );
  };

  const allFilled = Object.keys(question.answers).every(
    (key) => userAnswers[key]
  );

  const handleSubmit = () => {
    if (!submitted) {
      const correct = Object.keys(question.answers).every(
        (key) => question.answers[key] === userAnswers[key]
      );

      setShowFeedback(true);
      setSubmitted(true);
      setIsCorrect(correct);

      setQuestionState({
        userAnswers,
        submitted: true,
        showFeedback: true,
        isCorrect: correct,
        shuffledOptions,
      });
    } else {
      onNext?.();
    }
  };

  return (
    <DndContext onDragEnd={handleDrop}>
      <div className="quiz-question">
        <h2>Fill in the blanks with the correct Linux commands</h2>
        {renderTemplate()}

        {!submitted ? (
          <div className="instruction-box">
            <div className="options-wrapper">
              {shuffledOptions
                .filter((opt) => !Object.values(userAnswers).includes(opt))
                .map((opt) => (
                  <OptionCard key={opt} id={opt} label={opt} />
                ))}
            </div>
          </div>
        ) : (
          <div className="feedback-box">
            <p className="feedback-text">
              {isCorrect
                ? "✅ Well done! You got all answers correct."
                : "❌ Not quite, some commands were incorrect."}
            </p>
            <p className="feedback-score">
              Correct answers:{" "}
              {
                Object.keys(question.answers).filter(
                  (key) => question.answers[key] === userAnswers[key]
                ).length
              }
              /{Object.keys(question.answers).length}
            </p>
          </div>
        )}

        <div className="question-controls">
          <button className="back-button" onClick={onBack} disabled={isFirst}>
            BACK
          </button>

          <button
            disabled={!allFilled && !submitted}
            className={`submit-button ${submitted ? "success" : ""}`}
            onClick={handleSubmit}
          >
            {submitted ? "NEXT" : "SUBMIT"}
          </button>
        </div>
      </div>
    </DndContext>
  );
}

export default FillInTheBlankQuestion;
