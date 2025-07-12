import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal   from "../components/Modal";
const PKEY = id => `qp_${id}`;
const load = id => JSON.parse(localStorage.getItem(PKEY(id)) || "{}");
const save = (id, obj) =>
  localStorage.setItem(PKEY(id), JSON.stringify(obj));
export default function QuizCategory() {
  const { id }   = useParams();       
  const nav      = useNavigate();

  const [topics, setTopics] = useState([]);
  const [ready , setReady ] = useState(false);
  const [sel   , setSel   ] = useState(null);

  useEffect(() => {
    setReady(false);
    fetch(`/quiz-data/category-${id}.json`)
      .then(r => r.json())
      .then(data =>
        setTopics(
          data.map(t => ({
            ...t,
            stars    : 0,
            attempts : 0,
            ...load(t.id),
          }))
        )
      )
      .finally(() => setReady(true));
  }, [id]);

  function handleStart() {
    const now = new Date().toLocaleDateString("de-DE");

    save(sel.id, {
      stars      : Math.min((sel.stars || 0) + 1, 5),
      attempts   : (sel.attempts || 0) + 1,
      lastAttempt: now,
    });

    nav(`/quiz/${id}/${sel.id}`);
  }

  if (!ready) return <p style={{ padding: 20 }}>Lade Themen…</p>;

  return (
    <div style={S.page}>
      <Sidebar />

      <div style={S.grid}>
        {topics.map(t => (
          <div key={t.id} style={S.card}>
            {t.image && (
              <img
                src={t.image}
                alt={t.title}
                style={{ width: 60, marginBottom: 15 }}
              />
            )}

            <h3>{t.title}</h3>

            <p style={S.stars}>
              {"★".repeat(t.stars) + "☆".repeat(5 - t.stars)}
            </p>

            <button style={S.btn} onClick={() => setSel(t)}>
              Quiz starten
            </button>
          </div>
        ))}
      </div>

      {sel && (
        <Modal topic={sel} onClose={() => setSel(null)} onStart={handleStart} />
      )}
    </div>
  );
}
const S = {
  page : { fontFamily: "'Courier Prime', monospace", padding: "2rem", textAlign: "center" },
  grid : { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 20 },
  card : { border: "2px solid green", borderRadius: 10, background: "#f9f9f9", padding: 20 },
  stars: { fontSize: "1.4rem", color: "gold", margin: "10px 0" },
  btn  : { padding: "10px 20px", background: "#4caf50", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" },
};
