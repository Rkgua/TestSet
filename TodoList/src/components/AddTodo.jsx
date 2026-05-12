import { useState } from "react";

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); //阻止了原生表单提交导致的页面刷新行为
    onAdd(text);
    setText(""); // 提交后清空输入框，准备下一次输入
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, marginBottom: 16 }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="添加一个新的任务..."
        style={{
          flex: 1,
          padding: "8px 12px",
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />
      <button
        type="submit"
        style={{
          background: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        Add
      </button>
    </form>
  );
};

export default AddTodo;
