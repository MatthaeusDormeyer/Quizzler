import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Result from "./Result";
import Header from "./Header";
import Sidebar from "../components/Sidebar";

export default function ResultWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { correctAnswers, totalQuestions, topicName, topicId, elapsedSeconds } =
    location.state || {};

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((prev) => !prev)}
        onLogout={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        setActiveScreen={() => navigate("/home")}
      />

      <div style={{ flex: 1 }}>
        <Header />
        <main style={{ paddingTop: "150px" }}>
          <Result
            correctAnswers={correctAnswers}
            totalQuestions={totalQuestions}
            topicName={topicName}
            topicId={topicId}
            elapsedSeconds={elapsedSeconds}
            onRetry={() => navigate(`/quiz/${topicId}`)}
          />
        </main>
      </div>
    </div>
  );
}
