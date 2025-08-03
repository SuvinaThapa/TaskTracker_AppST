import React, { useState, useEffect } from "react";
import {
  fetchTasks,
  addTask,
  updateTask,
  toggleTaskComplete,
  deleteTaskById,
} from "./api/task";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Button from "./components/Button";
import TaskList from "./components/TaskList";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  // Removed sessionExpired state because we redirect immediately on expiry

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const initializeApp = async () => {
      try {
        const data = await fetchTasks();
        setTasks(Array.isArray(data) ? data : []);
        setWelcomeMessage("Welcome to your Task Tracker!");
        const timer = setTimeout(() => setWelcomeMessage(""), 30000);
        return () => clearTimeout(timer);
      } catch (err) {
        if (err.message.includes("Session expired")) {
          localStorage.removeItem("token");
          setIsLoggedIn(false); // immediately redirect to login form
          setTasks([]);
          setError(null);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowRegister(false);
    setError(null);
    setLoading(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setTasks([]);
    setError(null);
  };

  const handleSubmitTask = async () => {
    if (!newTask.trim()) return;

    try {
      if (editingTaskId) {
        const updatedTask = await updateTask(editingTaskId, newTask);
        setTasks((prev) =>
          prev.map((task) =>
            task._id.toString() === editingTaskId ? updatedTask : task
          )
        );
        setEditingTaskId(null);
      } else {
        const addedTask = await addTask(newTask);
        setTasks((prev) => [...prev, addedTask]);
      }
      setNewTask("");
    } catch (err) {
      if (err.message.includes("Session expired")) {
        localStorage.removeItem("token");
        setIsLoggedIn(false); // redirect to login form immediately
      } else {
        setError(err.message);
      }
    }
  };

  const handleEditTask = (id) => {
    const taskToEdit = tasks.find((task) => task._id.toString() === id);
    if (taskToEdit) {
      setNewTask(taskToEdit.text);
      setEditingTaskId(id);
    }
  };

  const deleteTask = async (id) => {
    const task = tasks.find((task) => task._id.toString() === id);
    if (!task) return;

    if (!task.completed) {
      return alert("Task not completed yet! Please complete it before deleting.");
    }

    try {
      await deleteTaskById(id);
      setTasks((prev) => prev.filter((t) => t._id.toString() !== id));
    } catch (err) {
      if (err.message.includes("Session expired")) {
        localStorage.removeItem("token");
        setIsLoggedIn(false); // redirect to login immediately
      } else {
        setError("Failed to delete task");
      }
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = tasks.find((task) => task._id.toString() === id);
      if (!task) return;

      const updatedTask = await toggleTaskComplete(id, !task.completed);
      setTasks((prev) =>
        prev.map((t) => (t._id.toString() === id ? updatedTask : t))
      );
    } catch (err) {
      if (err.message.includes("Session expired")) {
        localStorage.removeItem("token");
        setIsLoggedIn(false); // redirect to login immediately
      } else {
        setError("Failed to toggle task completion");
      }
    }
  };

  if (!isLoggedIn) {
    return showRegister ? (
      <Register
        onRegisterSuccess={handleLoginSuccess}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  if (loading) return <div className="p-4">Loading tasks...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogout={handleLogout} />
      <main className="container mx-auto my-8 flex-grow p-4">
        {welcomeMessage && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
            <p>{welcomeMessage}</p>
          </div>
        )}

        <h2 className="text-xl mb-4">Dashboard</h2>

        <div className="mb-6 flex">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task..."
          />
          <Button
            type={editingTaskId ? "update" : "add"}
            onClick={handleSubmitTask}
          />
        </div>

        <TaskList
          tasks={Array.isArray(tasks) ? tasks : []}
          onDelete={deleteTask}
          onToggleComplete={toggleComplete}
          onEdit={handleEditTask}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
