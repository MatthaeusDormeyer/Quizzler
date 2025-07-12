import { useState } from "react";
import quizzes from "../../data/quizzes.json";
import FillInTheBlankQuestion from "./QuizQuestion";
import MatchOutputQuestion from "./MatchOutputQuestion";

function QuizOverview() {
  const quiz = quizzes[0];
  const questions = quiz?.questionsByLevel?.Beginner ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  if (!currentQuestion) {
    return <p>✅ Все вопросы завершены! Молодец.</p>;
  }

  // 🔁 Встроенный роутер по типу
  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "template-fill":
        return (
          <FillInTheBlankQuestion
            question={currentQuestion}
            onNext={handleNext}
            onBack={handleBack}
            isFirst={currentIndex === 0}
          />
        );
      case "match-output":
        return (
          <MatchOutputQuestion
            question={currentQuestion}
            onNext={handleNext}
            onBack={handleBack}
            isFirst={currentIndex === 0}
          />
        );
      default:
        return <p>❌ Unknown question type: {currentQuestion.type}</p>;
    }
  };

  return (
    <div>
      <h1>
        {quiz.title} {currentIndex + 1} / {questions.length}
      </h1>

      {renderQuestion()}
    </div>
  );
}

export default QuizOverview;
