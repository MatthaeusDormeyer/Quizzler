import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import Header from "./Header";

export default function Home({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selQuiz, setSelQuiz] = useState(null);
  const [score] = useState(42); // TODO: echten Score holen
  const [bestResults, setBestResults] = useState({});
  const [userResults, setUserResults] = useState([]);
  const [activeScreen, setActiveScreen] = useState("home");
  const navigate = useNavigate();

  useEffect(() => {
    // Lade alle Quizthemen
    fetch("/quiz-data/topics.json")
      .then((r) => r.json())
      .then(setQuizzes)
      .catch((err) =>
        console.error("Quiz-JSON konnte nicht geladen werden:", err)
      );

    // Lade Bestleistungen + vollständigen Verlauf für den Benutzer
    if (user?.email) {
      fetch(
        `http://localhost:3001/best-results?email=${encodeURIComponent(
          user.email
        )}`
      )
        .then((res) => res.json())
        .then(setBestResults)
        .catch((err) =>
          console.error("Bestleistungen konnten nicht geladen werden:", err)
        );

      fetch(
        `http://localhost:3001/all-results?email=${encodeURIComponent(
          user.email
        )}`
      )
        .then((res) => res.json())
        .then(setUserResults)
        .catch((err) =>
          console.error("Verlauf konnte nicht geladen werden:", err)
        );
    }
  }, [user]);

  return (
    <div style={S.wrapper}>
      <Header />
      <Sidebar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        onLogout={() => {
          localStorage.removeItem("token");
          onLogout?.();
        }}
        setActiveScreen={setActiveScreen}
      />

      <main
        style={{
          ...S.main,
          marginRight: sidebarOpen ? 240 : 0,
          paddingTop: "150px",
        }}
      >
        {activeScreen === "home" && (
          <>
            <h1 style={S.h2}>Willkommen, {user?.name}!</h1>
            <h2 style={S.lead}>Wähle einen Quiz, um loszulegen</h2>

            <div style={S.grid}>
              {quizzes.map((q) => (
                <div key={q.id} style={S.card}>
                  <img src={q.image} alt={q.title} style={S.img} />
                  <h3>{q.title}</h3>

                  {bestResults[q.title] !== undefined && (
                    <p style={S.stars}>
                      Beste Leistung: {"⭐️".repeat(bestResults[q.title])}
                    </p>
                  )}

                  <button style={S.btn} onClick={() => setSelQuiz(q)}>
                    START
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeScreen === "account" && (
          <>
            <h2 style={S.h2}>Hallo, {user?.name}!</h2>
            <p style={S.lead}>Hier ist dein Quiz-Verlauf:</p>

            {userResults.length === 0 ? (
              <p>Du hast noch keine Quizversuche.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {userResults.map((r, idx) => (
                  <li key={idx} style={S.card}>
                    <strong>{r.topic}</strong>
                    <br />
                    ⭐️ {r.stars} Sterne
                    <br />
                    {r.correctAnswers}/{r.totalQuestions} korrekt
                    <br />
                    Zeit: {r.elapsedSeconds}s<br />
                    Abzeichen: {r.badge}
                    <br />
                    <small>{new Date(r.createdAt).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      {selQuiz && <Modal topic={selQuiz} onClose={() => setSelQuiz(null)} />}
    </div>
  );
}

const S = {
  wrapper: {
    minHeight: "100vh",
    fontFamily: "'Courier Prime', monospace",
  },
  stars: {
    margin: "8px 0",
    fontSize: 14,
    color: "#333",
  },

  main: {
    flex: 1,
    padding: "120px 40px 40px 40px",
    transition: "margin-left .3s ease",
    width: "100%",
  },

  h2: { marginTop: 20, marginBottom: 12, textAlign: "left" },
  lead: { marginBottom: 24, textAlign: "left" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: 20,
    marginTop: 10,
    justifyContent: "start",
  },

  card: {
    border: "2px solid green",
    borderRadius: 10,
    padding: 20,
    background: "#f9f9f9",
    textAlign: "center",
    marginBottom: 10,
  },

  img: { width: 90, marginBottom: -20, objectFit: "contain" },

  btn: {
    padding: "10px 20px",
    background: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};
