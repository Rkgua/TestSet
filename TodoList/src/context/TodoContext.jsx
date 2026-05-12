import { createContext, useReducer, useContext } from "react";

// 创建了一个全局的“通信管道”。null 是默认值，用于后续检测是否被 Provider 包裹。
const TodoContext = createContext(null);

// 状态管理的“大脑”。它接收当前的 state 和一个 action，根
// // 据 action.type 决定如何更新状态。
const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now(), text: action.payload, completed: false },
        ],
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t,
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
};

// useReducer 来初始化和管理状态
export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, { todos: [] });
  return (
    // 将 { todos: state.todos, dispatch } 
    // 作为一个整体对象注入到 Context 中。这意味着任何子组件都可以获取到当前的数据列表 (todos) 和修改数据的能力 (dispatch)
    <TodoContext.Provider value={{ todos: state.todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};


// 这是一个封装层，简化了 useContext 的调用，
// 并且添加了错误处理，确保开发者正确使用这个 Context。
export const useTodoContext = () => {
  const ctx = useContext(TodoContext);
  if (!ctx)
    throw new Error(
      "useTodoContext must be used within TodoProvider(开发者在 TodoProvider 外部错误地使用了这个 useTodoContext)",
    );
  return ctx;
};
