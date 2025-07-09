import { useState, useEffect } from "react";
import { fetchTasks, addTask } from "./api/task";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Button from "./components/Button";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null); // NEW

  // Fetch tasks on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
        setWelcomeMessage("Welcome to your Task Tracker!");
        const timer = setTimeout(() => setWelcomeMessage(""), 30000);
        return () => clearTimeout(timer);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    initializeApp();
  }, []);

  // Add or Update task
  const handleSubmitTask = async () => {
    if (!newTask.trim()) return;
    try {
      if (editingTaskId) {
        const updatedTasks = tasks.map((task) =>
          task.id === editingTaskId ? { ...task, text: newTask } : task
        );
        setTasks(updatedTasks);
        setEditingTaskId(null);
      } else {
        const addedTask = await addTask(newTask);
        setTasks([...tasks, addedTask]);
      }
      setNewTask("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Start editing
  const handleEditTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setNewTask(taskToEdit.text);
      setEditingTaskId(id);
    }
  };

  // Delete a completed task
  const deleteTask = (id) => {
    if (tasks.find((task) => task.id === id && task.completed)) {
      setTasks(tasks.filter((task) => task.id !== id));
    } else {
      alert("Task not completed yet! Please complete it before deleting.");
    }
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  if (loading) return <div className="p-4">Loading tasks...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
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
          tasks={tasks}
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
