const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  email: { type: String, required: true },
  topic: { type: String, required: true },
  stars: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  elapsedSeconds: { type: Number, required: true },
  badge: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);
