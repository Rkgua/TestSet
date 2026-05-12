import { useState } from "react";
import { useTodoContext } from "../context/TodoContext";

export const useTodos = () => {
  const { todos, dispatch } = useTodoContext();
  const [filter, setFilter] = useState("all");

  const addTodo = (text) => {
    if (text.trim()) dispatch({ type: "ADD_TODO", payload: text });
  };

  const toggleTodo = (id) => dispatch({ type: "TOGGLE_TODO", payload: id });

  const deleteTodo = (id) => dispatch({ type: "DELETE_TODO", payload: id });

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return {
    todos: filteredTodos,
    allTodos: todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    filter,
    setFilter,
  };
};
