import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import todoIcon from "./assets/任务栏.svg";
const App = () => {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <img
          src={todoIcon}
          alt="任务栏"
          style={{
            width: 32,
            height: 32,
          }}
        />
        TodoList
      </h1>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home filter="all" />} />
        <Route path="/active" element={<Home filter="active" />} />
        <Route path="/completed" element={<Home filter="completed" />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
