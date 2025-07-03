
const TaskList = ({ tasks, onDelete, onToggleComplete }) => {
    //used usestae as when we click on new button the state is cnagug
  return (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <p className="text-gray-500">No task has been added.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task.id)}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span
                  className={`ml-3 ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                  }`}
                >
                  {task.text}
                </span>
              </div>

              {/* Styled delete button */}
            <button
  onClick={() => onDelete(task.id)}
  disabled={!task.completed}
  className={`px-4 py-2 rounded focus:ring-2 focus:ring-red-400 text-white ${
    task.completed
      ? "bg-red-500 hover:bg-red-600"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  Delete
</button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;