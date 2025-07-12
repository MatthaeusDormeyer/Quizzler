import { useEffect, useState } from "react";
import { useNavigate }       from "react-router-dom";
import Sidebar  from "../components/Sidebar";
import Modal    from "../components/Modal";
const PKEY = id => `qp_${id}`;
const load  = id => JSON.parse(localStorage.getItem(PKEY(id)) || "{}");
const save  = (id, obj) => localStorage.setItem(PKEY(id), JSON.stringify(obj));

export default function Quiz() {
  const nav = useNavigate();

  const [topics, setTopics]   = useState([]);
  const [ready , setReady]    = useState(false);
  const [sel   , setSel]      = useState(null);

  useEffect(() => {
    fetch("/quiz-data/topics.json")
      .then(r => r.json())
      .then(data => {
        setTopics(
          data.map(t => ({ ...t, ...load(t.id), stars: 0, attempts: 0, ...load(t.id) }))
        );
        setReady(true);
      });
  }, []);

  const handleStart = () => {
    const now = new Date();
    setTopics(prev =>
      prev.map(t =>
        t.id === sel.id
          ? (save(t.id, {
                stars:     Math.min((t.stars || 0) + 1, 5),
                attempts:  (t.attempts || 0) + 1,
                last:      now.toLocaleDateString(),
                time:      "—"
             }),
            { ...t, stars: Math.min(t.stars + 1, 5), attempts: t.attempts + 1, last: now.toLocaleDateString() })
          : t
      )
    );
    setSel(null);
    nav(`/quiz/${sel.id}`);          
  };

  if (!ready) return <p style={{padding:40}}>Loading…</p>;

  return (
    <div style={S.page}>
      <Sidebar onLogout={()=>{localStorage.removeItem("token"); nav("/login");}} />

      <h2 style={S.h2}>Willkommen zu Informatik</h2>
      <p  style={S.p }>Wähle ein Thema, um mit dem Quiz zu starten</p>

      <div style={S.grid}>
        {topics.map(t => (
          <div key={t.id} style={S.card}>
            <img src={t.image} alt={t.title} style={{width:48,marginBottom:14}}/>
            <h3>{t.title}</h3>
            <p style={S.stars}>{"★".repeat(t.stars||0)+"☆".repeat(5-(t.stars||0))}</p>
            <button style={S.btn} onClick={()=>setSel(t)}>Quiz starten</button>
          </div>
        ))}
      </div>

      {sel && <Modal topic={sel} onClose={()=>setSel(null)} onStart={handleStart}/>}
    </div>
  );
}

const S = {
  page : {fontFamily:"Courier Prime, monospace",padding:"2rem",textAlign:"center"},
  h2   : {marginTop:80},
  p    : {marginBottom:24},
  grid : {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:20},
  card : {border:"2px solid green",borderRadius:10,background:"#f9f9f9",padding:20},
  stars: {fontSize:"1.4rem",color:"gold",margin:"10px 0"},
  btn  : {padding:"10px 20px",background:"#4caf50",color:"#fff",border:"none",borderRadius:5,cursor:"pointer"}
};
