const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const filePath = "tasks.json";

// Helper to read tasks
function readTasks() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to write tasks
function writeTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(readTasks());
});

// Add a new task
app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  tasks.push(req.body);
  writeTasks(tasks);
  res.status(201).send("Task added");
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter(task => task.id !== Number(req.params.id));
  writeTasks(tasks);
  res.send("Task deleted");
});

// Toggle complete
app.put("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  tasks = tasks.map(task =>
    task.id === Number(req.params.id)
      ? { ...task, completed: !task.completed }
      : task
  );
  writeTasks(tasks);
  res.send("Task updated");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
