const API_URL = "http://localhost:5000/api/tasks";

// Helper to get token from localStorage
const getAuthToken = () => localStorage.getItem("token");

// Fetch all tasks
export const fetchTasks = async () => {
  const token = getAuthToken();
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
};

// Add new task
export const addTask = async (text) => {
  const token = getAuthToken();
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text }),
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) throw new Error("Failed to add task");
  return response.json();
};

// Update task text by id
export const updateTask = async (id, text) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text }),
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
};

// Toggle task completion by id
export const toggleTaskComplete = async (id, completed) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/${id}/toggle`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ completed }),
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) throw new Error("Failed to toggle task completion");
  return response.json();
};

// Delete task by id
export const deleteTaskById = async (id) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) throw new Error("Failed to delete task");
  return response.json();
};
