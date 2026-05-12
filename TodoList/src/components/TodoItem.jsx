const TodoItem = ({ todo, onToggle, onDelete }) => (
  <li
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 0",
      borderBottom: "1px solid #eee",
    }}
  >
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => onToggle(todo.id)}
    />
    <span
      style={{
        flex: 1,
        textDecoration: todo.completed ? "line-through" : "none",
        color: todo.completed ? "#999" : "#333",
      }}
    >
      {todo.text}
    </span>
    <button
      onClick={() => onDelete(todo.id)}
      style={{
        background: "#dc3545",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        padding: "4px 10px",
        cursor: "pointer",
      }}
    >
      Delete
    </button>
  </li>
);

export default TodoItem;
