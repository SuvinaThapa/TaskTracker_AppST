
import { useState, useEffect } from "react";
import { fetchTasks, addTask } from "./api/task";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Button from "./components/Button";
import TaskList from "./components/TaskList"; // New component

//[variable,function] is called hook
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks
  //fetch tasks from backend on componenets mount
//reload hune betekai chalne hook is useeffect
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

//Add new task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const addedTask = await addTask(newTask);
      setTasks([...tasks, addedTask]);
      setNewTask("");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = (id) => {
    if (tasks.find((task) => task.id === id && task.completed))
      // Check if the task is completed
      setTasks(tasks.filter((task) => task.id !== id));
    else alert("Task not completed yet! Please complete it before deleting.");
  };

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
            placeholder="Enter new task..."
          />

          <Button type="add" onClick={handleAddTask} />
        </div>
        <TaskList
          tasks={tasks}
          onDelete={deleteTask}
          onToggleComplete={toggleComplete}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;