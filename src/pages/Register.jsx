import { useState } from "react";

function Register({ onRegister, goLogin }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !name || !password) {
      setErrorMsg("Fülle bitte alle Felder aus ;)");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        setErrorMsg(data.message || "Registrierung fehlgeschlagen");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }

      onRegister(data); // ⬅ Token an App übergeben
    } catch (err) {
      console.error("Fehler bei der Registrierung:", err);
      setErrorMsg("Netzwerkfehler bei der Registrierung");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div style={styles.container}>
      {showError && <div style={styles.toast}>{errorMsg}</div>}
      <h1 style={styles.title}>Quizzler</h1>
      <h2 style={styles.sub}>Registrierung</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={name}
            style={styles.input}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            style={styles.input}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Passwort:</label>
          <input
            type="password"
            value={password}
            style={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.button}>
            Registrieren
          </button>
          <button type="button" style={styles.button} onClick={goLogin}>
            Zum Login
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Courier Prime', monospace",
    textAlign: "center",
    marginTop: "50px",
  },
  title: {
    backgroundColor: "white",
    color: "black",
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "2rem",
    borderRadius: "5px",
  },
  sub: {
    marginTop: "20px",
    color: "black",
  },
  form: {
    display: "inline-block",
    marginTop: "20px",
    textAlign: "left",
  },
  inputGroup: {
    marginBottom: "15px",
    color: "black",
  },
  input: {
    width: "250px",
    padding: "8px",
    border: "2px solid green",
    borderRadius: "4px",
    fontSize: "1rem",
    fontFamily: "'Courier Prime', monospace",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginTop: "20px",
  },
  button: {
    backgroundColor: "white",
    border: "2px solid green",
    padding: "8px 16px",
    fontFamily: "'Courier Prime', monospace",
    cursor: "pointer",
    fontSize: "1rem",
    width: "250px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  toast: {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#ffdddd",
    color: "red",
    padding: "10px 20px",
    border: "1px solid red",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "'Courier Prime', monospace",
    zIndex: 1000,
    animation: "fadeOut 3s forwards",
  },
};

export default Register;
