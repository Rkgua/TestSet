import { useEffect } from "react";
import { useTodos } from "../hooks/useTodos";
import AddTodo from "../components/AddTodo";
import TodoItem from "../components/TodoItem";

const Home = ({ filter: routeFilter }) => {
  const {
    todos,
    allTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    filter,
    setFilter,
  } = useTodos();
  useEffect(() => {
    setFilter(routeFilter);
  }, [routeFilter, setFilter]);

  return (
    <div>
      <h2>
        {filter === "all"
          ? "All"
          : filter === "active"
            ? "Active"
            : "Completed"}
        {" Todos"}
      </h2>
      <AddTodo onAdd={addTodo} />
      {todos.length === 0 ? (
        <p style={{ color: "#999" }}>等待任务发出</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      )}
      {allTodos.length > 0 && (
        <p style={{ marginTop: 16, color: "#666", fontSize: "0.9em" }}>
          {allTodos.filter((t) => !t.completed).length} 个任务未完成
        </p>
      )}
    </div>
  );
};

export default Home;
