import { useState, useEffect } from "react";
import FillInTheBlankQuestion from "./QuizQuestion";
import MatchOutputQuestion from "./MatchOutputQuestion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../Header";

function QuizOverview() {
  const { topicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [questionStates, setQuestionStates] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const searchParams = new URLSearchParams(location.search);
  const level = searchParams.get("level")?.toLowerCase() || "beginner";

  useEffect(() => {
    fetch(`/quiz-data/${topicId}.json`)
      .then((r) => r.json())
      .then(setQuizData)
      .catch((e) => console.error("Fehler beim Laden des Quiz-Dokuments:", e));
  }, [topicId]);
  -useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const quiz = quizData;
  const questions =
    quiz?.questionsByLevel?.[level.charAt(0).toUpperCase() + level.slice(1)] ||
    [];

  const currentQuestion = questions[currentIndex];
  const savedState = currentQuestion
    ? questionStates[currentIndex]?.[currentQuestion.type] || {}
    : {};

  useEffect(() => {
    if (!quiz) return;

    if (!currentQuestion) {
      const totalQuestions = questions.length;
      const correctAnswers = Object.values(questionStates).filter(
        (stateByType) =>
          Object.values(stateByType).some((state) => state?.isCorrect === true)
      ).length;

      navigate("/result", {
        state: {
          correctAnswers,
          totalQuestions,
          topicName: quiz.title || topicId,
          elapsedSeconds,
        },
        replace: true,
      });
    }
  }, [
    currentQuestion,
    questionStates,
    navigate,
    quiz,
    elapsedSeconds,
    topicId,
    questions.length,
  ]);

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  const handleNext = () => setCurrentIndex((prev) => prev + 1);
  const handleBack = () => setCurrentIndex((prev) => Math.max(0, prev - 1));

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const commonProps = {
      question: currentQuestion,
      index: currentIndex,
      onNext: handleNext,
      onBack: handleBack,
      savedState,
      setQuestionState: (state) =>
        setQuestionStates((prev) => ({
          ...prev,
          [currentIndex]: {
            ...(prev[currentIndex] || {}),
            [currentQuestion.type]: state,
          },
        })),
    };

    switch (currentQuestion.type) {
      case "template-fill":
        return <FillInTheBlankQuestion {...commonProps} />;
      case "match-output":
        return (
          <MatchOutputQuestion {...commonProps} isFirst={currentIndex === 0} />
        );
      default:
        return <p>❌ Unknown question type: {currentQuestion.type}</p>;
    }
  };

  if (!quiz) return <p>❌ Quiz topic not found: {topicId}</p>;
  if (questions.length === 0)
    return <p>❌ No questions found for this level.</p>;

  return (
    <div>
      <Header />
      <h1>
        {quiz.title} {currentIndex + 1} / {questions.length} – ⏱{" "}
        {formatTime(elapsedSeconds)}
      </h1>
      {renderQuestion()}
    </div>
  );
}

export default QuizOverview;
