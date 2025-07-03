const API_URL = 'http://localhost:5000/api/tasks';
export const fetchTasks = async () => {
const response = await fetch(API_URL);
return await response.json();
};

export const addTask = async (text) => {
const response = await fetch(API_URL, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ text })
});
return await response.json();
};