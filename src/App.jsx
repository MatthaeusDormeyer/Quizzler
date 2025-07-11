import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Result from "./pages/Result";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
        navigate("/home");
      } catch (e) {
        console.error("Ungültiger Token:", e);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("token", userData.token);
    const payload = JSON.parse(atob(userData.token.split(".")[1]));
    setUser(payload);
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      {/* Automatische Weiterleitung */}
      {/* <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} /> */}
      <Route path="/" element={<Navigate to="/result" />} />

      <Route
        path="/login"
        element={
          <Login
            onLogin={handleLogin}
            goRegister={() => navigate("/register")}
          />
        }
      />

      <Route
        path="/register"
        element={
          <Register
            onRegister={handleLogin}
            goLogin={() => navigate("/login")}
          />
        }
      />

      {/* <Route
        path="/home"
        element={
          user ? (
            <Home user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      /> */}

      <Route path="/home" element={<Home />} />

      <Route
        path="/result"
        element={
          <Result
            correctAnswers={4}
            totalQuestions={6}
            onRetry={() => navigate("/quiz")}
            topicName="linux-basics"
          />
        }
      />
    </Routes>
  );
}
export default App;
