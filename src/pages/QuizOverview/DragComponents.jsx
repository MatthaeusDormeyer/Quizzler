import { useDraggable, useDroppable } from "@dnd-kit/core";

export function OptionCard({ id, label }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="option-card"
      {...listeners}
      {...attributes}
    >
      {label}
    </div>
  );
}

export function DropZone({
  id,
  blankId,
  value,
  onClear,
  correctAnswer,
  showFeedback,
}) {
  const zoneId = blankId ? `blank-${blankId}` : id;
  const { setNodeRef } = useDroppable({ id: zoneId });

  const isIncorrect = showFeedback && value && value !== correctAnswer;
  const isCorrect = showFeedback && value === correctAnswer;

  const className = `blank-zone ${
    isCorrect ? "correct" : isIncorrect ? "incorrect" : ""
  }`;

  const handleClick = () => {
    if (value && !showFeedback && onClear && blankId) {
      onClear(blankId);
    }
  };

  return (
    <span ref={setNodeRef} className={className} onClick={handleClick}>
      <span className="answer-wrapper">
        {value ?? "____"}
        {isIncorrect && (
          <span className="tooltip">
            Correct: <strong>{correctAnswer}</strong>
          </span>
        )}
      </span>
    </span>
  );
}
