import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [page, setPage] = useState("login"); // login, register, home

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setPage("login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      {page === "login" && (
        <Login onLogin={handleLogin} goRegister={() => setPage("register")} />
      )}
      {page === "register" && (
        <Register onRegister={handleLogin} goLogin={() => setPage("login")} />
      )}
      {page === "home" && <Home user={user} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
