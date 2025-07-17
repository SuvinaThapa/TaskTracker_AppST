const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);


// let tasks = [...] // Hardcoded array
// app.get("/api/tasks", (req, res) => res.json(tasks));

// // NEW:
// app.get("/api/tasks", authenticateJWT, async (req, res) => {
// try {
// const tasks = await Task.find({ user: req.user.id });
// res.json(tasks);
// } catch (err) {
// res.status(500).json({ message: "Error fetching tasks" });
// }
// });