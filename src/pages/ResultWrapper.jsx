import { useLocation, useNavigate } from "react-router-dom";
import Result from "./Result";

export default function ResultWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  const { correctAnswers, totalQuestions, topicName, elapsedSeconds } =
    location.state || {};

  if (!correctAnswers && !totalQuestions) {
    return <p>⚠️ Keine Daten gefunden. Bitte Quiz erneut starten.</p>;
  }

  return (
    <Result
      correctAnswers={correctAnswers}
      totalQuestions={totalQuestions}
      topicName={topicName}
      onRetry={() => navigate(-1)}
      elapsedSeconds={elapsedSeconds}
    />
  );
}
