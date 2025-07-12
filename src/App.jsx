import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import QuizCategory from "./pages/QuizCategory";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);

        if (location.pathname === "/") {
          navigate("/home", { replace: true });
        }
      } catch (err) {
        console.error("Ungültiger Token:", err);
        localStorage.removeItem("token");
      }
    }
    setReady(true);
  }, [location.pathname, navigate]);

  function handleLogin({ token }) {
    localStorage.setItem("token", token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser(payload);
    navigate("/home");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }

  if (!authReady) return null;

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? "/home" : "/login"} replace />}
      />

      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/home" replace />
          ) : (
            <Login
              onLogin={handleLogin}
              goRegister={() => navigate("/register")}
            />
          )
        }
      />

      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/home" replace />
          ) : (
            <Register
              onRegister={handleLogin}
              goLogin={() => navigate("/login")}
            />
          )
        }
      />

      <Route
        path="/home"
        element={
          user ? (
            <Home user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/quiz/:categoryId"
        element={user ? <QuizCategory /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/quiz/:categoryId/:topicId"
        element={user ? <Quiz /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/result"
        element={
          user ? (
            <Result
              correctAnswers={4}
              totalQuestions={6}
              onRetry={() => navigate("/quiz")}
              topicName="linux-basics"
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/test" element={<QuizOverview />} />
    </Routes>
  );
}
