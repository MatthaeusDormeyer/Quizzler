import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import Sidebar                 from "../components/Sidebar";
import Modal                   from "../components/Modal";

export default function Home({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizzes,     setQuizzes    ] = useState([]);
  const [selQuiz,     setSelQuiz    ] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/quiz-data/topics.json")
      .then(r => r.json())
      .then(setQuizzes)
      .catch(err =>
        console.error("Quiz-JSON konnte nicht geladen werden:", err)
      );
  }, []);

  function handleStart() {
    if (!selQuiz) return;
    setSelQuiz(null);
    navigate(`/quiz/${selQuiz.id}`);
  }

  return (
    <div style={st.wrapper}>
      <Sidebar
        open   ={sidebarOpen}
        toggle ={() => setSidebarOpen(o => !o)}
        onLogout={() => {
          localStorage.removeItem("token");
          onLogout?.();
        }}
      />

      <main style={{ ...st.main, marginLeft: sidebarOpen ? 240 : 0 }}>
        <h2 style={st.h2}>Willkommen, {user?.name}!</h2>
        <p  style={st.lead}>Wähle einen Quiz, um loszulegen</p>

        <div style={st.grid}>
          {quizzes.map(q => (
            <div key={q.id} style={st.card}>
              <img src={q.image} alt={q.title} style={st.img} />
              <h3>{q.title}</h3>

              <button style={st.btn} onClick={() => setSelQuiz(q)}>
                Quiz wählen
              </button>
            </div>
          ))}
        </div>
      </main>

      {selQuiz && (
        <Modal
          topic   ={selQuiz}
          onClose ={() => setSelQuiz(null)}
          onStart ={handleStart}
        />
      )}
    </div>
  );
}

const st = {
  wrapper:{ display:"flex", minHeight:"100vh",
            fontFamily:"'Courier Prime', monospace" },

  main:   { flex:1, padding:40, transition:"margin-left .3s", width:"100%" },

  h2:     { marginTop:20, marginBottom:12, textAlign:"left" },
  lead:   { marginBottom:24, textAlign:"left" },

  grid:   { display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
            gap:20, marginTop:10, justifyContent:"start" },

  card:   { border:"2px solid green", borderRadius:10,
            padding:20, background:"#f9f9f9", textAlign:"center" },

  img:    { width:90, marginBottom:-20, objectFit:"contain" },

  btn:    { padding:"10px 20px", background:"#4caf50",
            color:"#fff", border:"none", borderRadius:5,
            cursor:"pointer" }
};
