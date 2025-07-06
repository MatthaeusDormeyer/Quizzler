const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 👉 MONGODB VERBINDUNG (NUR mongoose)
mongoose.connect("mongodb+srv://md:1234@quizcluster.epxzuwc.mongodb.net/sample_mflix?retryWrites=true&w=majority")
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB-Verbindungsfehler:", err));

// 👉 USER SCHEMA & MODEL
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

// 👉 REGISTRIERUNG
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User existiert bereits" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registriert" });
  } catch (err) {
    console.error("❌ Fehler bei /register:", err);
    res.status(500).json({ message: "Serverfehler bei Registrierung" });
  }
});

// 👉 LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User nicht gefunden" });

    if (user.password !== password) return res.status(401).json({ message: "Falsches Passwort" });

    res.status(200).json({ name: user.name, email: user.email });
  } catch (err) {
    console.error("❌ Fehler bei /login:", err);
    res.status(500).json({ message: "Serverfehler bei Login" });
  }
});

// 👉 SERVER START
app.listen(3001, () => {
  console.log("🚀 Backend läuft auf http://localhost:3001");
});
