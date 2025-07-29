import { useNavigate } from "react-router-dom";

export default function Sidebar({ open, toggle, onLogout, setActiveScreen }) {
  const navigate = useNavigate();

  return (
    <>
      <aside
        style={{
          ...styles.sidebar,
          right: open ? 0 : "-240px",
        }}
      >
        <h2 style={styles.logo}>Quizzler</h2>

        <nav style={styles.nav}>
          <button
            style={styles.navItem}
            onClick={() => {
              setActiveScreen("home");
              navigate("/home");
              toggle();
            }}
          >
            Home
          </button>

          <button
            style={styles.navItem}
            onClick={() => {
              setActiveScreen("account");
              toggle();
            }}
          >
            Account
          </button>
        </nav>

        <button style={styles.logout} onClick={onLogout}>
          Logout
        </button>
      </aside>

      <button
        onClick={toggle}
        style={{
          ...styles.burger,
          right: open ? 220 : 20,
          backgroundColor: open ? "#2e7d32" : "#4caf50",
        }}
      >
        {open ? "✕" : "☰"}
      </button>
    </>
  );
}

const styles = {
  burger: {
    position: "fixed",
    top: "30px",
    zIndex: 2001,
    border: "none",
    fontSize: "1.5rem",
    padding: "10px 14px",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
    transition: "right .3s",
  },

  sidebar: {
    position: "fixed",
    top: 0,
    bottom: 0,
    right: 0,
    width: 240,
    background: "#2e7d32",
    color: "#fff",
    padding: 20,
    transition: "right .3s",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    zIndex: 2000,
    borderLeft: "3px solid #1b5e20",
  },

  logo: {
    fontSize: "1.5rem",
    marginBottom: 30,
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  navItem: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "1rem",
    textAlign: "left",
    cursor: "pointer",
    padding: 10,
    borderRadius: 5,
  },

  logout: {
    background: "#c62828",
    border: "none",
    padding: 10,
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: 5,
    marginTop: "auto",
  },
};
