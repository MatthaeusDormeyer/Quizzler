const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const SECRET = "mein-geheimes-passwort"; // später in .env-Datei auslagern

const Result = require("./models/Result");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB-Verbindung
mongoose
  .connect(
    "mongodb+srv://md:1234@quizcluster.epxzuwc.mongodb.net/sample_mflix?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB-Verbindungsfehler:", err));

// 🧠 User Schema mit passwordHash + salt
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// 🔐 Hilfsfunktionen
function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString("hex");
}

function hashPassword(password, salt) {
  return crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

// 📝 Registrierung
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Alle Felder sind erforderlich." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User existiert bereits." });
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    const newUser = new User({ name, email, passwordHash, salt });
    await newUser.save();

    // ✅ JWT erstellen
    const token = jwt.sign({ name, email }, SECRET, { expiresIn: "1h" });

    // ✅ zurückgeben
    res.status(201).json({ token });
  } catch (err) {
    console.error("❌ Fehler bei /register:", err);
    res.status(500).json({ message: "Serverfehler bei Registrierung." });
  }
});

// 🔐 Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "E-Mail und Passwort erforderlich." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden." });
    }

    const passwordHash = hashPassword(password, user.salt);
    if (passwordHash !== user.passwordHash) {
      return res.status(401).json({ message: "Falsches Passwort." });
    }

    // ✅ JWT erstellen
    const token = jwt.sign({ name: user.name, email: user.email }, SECRET, {
      expiresIn: "1h",
    });

    // ✅ Token senden
    res.status(200).json({ token });
  } catch (err) {
    console.error("❌ Fehler bei /login:", err);
    res.status(500).json({ message: "Serverfehler bei Login." });
  }
});

//Save Results
app.post("/save-result", async (req, res) => {
  const {
    email,
    topic,
    stars,
    correctAnswers,
    totalQuestions,
    elapsedSeconds,
    badge,
  } = req.body;

  if (!email || !topic) {
    return res
      .status(400)
      .json({ error: "Email und Thema sind erforderlich." });
  }

  try {
    const result = new Result({
      email,
      topic,
      stars,
      correctAnswers,
      totalQuestions,
      elapsedSeconds,
      badge,
    });

    await result.save();

    res.status(200).json({ success: true, saved: result });
  } catch (err) {
    console.error("❌ Fehler beim Speichern:", err);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// 🚀 Server starten
app.listen(3001, () => {
  console.log("🚀 Backend läuft auf http://localhost:3001");
});
