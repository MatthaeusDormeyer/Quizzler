import { useState } from "react";

function Home({ user, onLogout }) {
  const [score] = useState(42); // Dummy-Score
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <div style={{ ...styles.sidebar, left: menuOpen ? 0 : "-240px" }}>
        <h2 style={styles.logo}>Quizzler</h2>
        <nav style={styles.nav}>
          <button style={styles.navItem} onClick={() => setMenuOpen(false)}>
            Home
          </button>
          <button style={styles.navItem} onClick={() => setMenuOpen(false)}>
            Account
          </button>
        </nav>
        <button style={styles.logout} onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Burger Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          ...styles.burger,
          left: menuOpen ? "220px" : "20px",
          backgroundColor: menuOpen ? "#2e7d32" : "#4caf50",
          color: "white",
          transition: "left 0.3s ease, background-color 0.3s ease",
        }}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Main Content */}
      <div style={{ ...styles.main, marginLeft: menuOpen ? "240px" : "0" }}>
        <h2>Willkommen, {user?.name}!</h2>
        <p>
          Deine Punktzahl beträgt gerade <strong>{score}</strong>.
        </p>

        <div style={styles.quizGrid}>
          {["Allgemeinwissen", "Informatik", "Sport"].map((title, i) => (
            <div key={i} style={styles.quizCard}>
              <h3>{title}</h3>
              <p>Teste dein Wissen im Bereich {title}!</p>
              <button
                style={styles.quizButton}
                onClick={() => alert(`Navigiere zu /quiz/${i}`)}
              >
                Quiz starten
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Courier Prime', monospace",
  },
  burger: {
    position: "fixed",
    top: "20px",
    zIndex: 1001,
    border: "none",
    fontSize: "1.5rem",
    padding: "10px 14px",
    cursor: "pointer",
    borderRadius: "8px 8px 8px 8px",
  },
  sidebar: {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    width: "240px",
    backgroundColor: "#2e7d32",
    color: "#fff",
    padding: "20px",
    transition: "left 0.3s ease-in-out",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  logo: {
    fontSize: "1.5rem",
    marginBottom: "30px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  navItem: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "1rem",
    textAlign: "left",
    cursor: "pointer",
    padding: "10px",
    borderRadius: "5px",
    transition: "background 0.2s",
  },
  logout: {
    background: "#c62828",
    border: "none",
    padding: "10px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "auto", // ⬅️ wichtig: nach unten drücken
  },
  main: {
    flex: 1,
    padding: "40px",
    transition: "margin-left 0.3s ease-in-out",
    width: "100%",
  },
  quizGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  quizCard: {
    border: "2px solid green",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  quizButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default Home;
