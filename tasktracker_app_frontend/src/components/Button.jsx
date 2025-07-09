const Button = ({ type, onClick }) => {
  const baseClasses = 'text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:offset';

  const styles = {
    add: "bg-green-500 hover:bg-green-600 focus:ring-green-400",
    delete: "bg-red-500 hover:bg-red-600 focus:ring-red-400",
    update: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400",
    edit: "bg-yellow-500 hover:bg-yellow-600 text-black focus:ring-yellow-400",
  };

  const buttonText = {
    add: "Add Task",
    delete: "Delete Task",
    update: "Update Task",
    edit: "Edit Task",
  };

  return (
    <button
      className={`${baseClasses} ${styles[type] || styles.add}`}
      onClick={onClick}
      type="button"
    >
      {buttonText[type] || "Add Task"}
    </button>
  );
};

export default Button;
