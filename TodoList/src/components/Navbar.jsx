import { NavLink } from "react-router-dom";

const linkStyle = { marginRight: 12, textDecoration: "none", color: "#555" };

const Navbar = () => {
  return (
    <nav
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #ddd",
        marginBottom: 20,
      }}
    >
      <NavLink
        to="/"
        end
        style={({ isActive }) => ({
          ...linkStyle,
          fontWeight: isActive ? "bold" : "normal",
          color: isActive ? "#007bff" : "#555",
        })}
      >
        所有
      </NavLink>
      <NavLink
        to="/active"
        style={({ isActive }) => ({
          ...linkStyle,
          fontWeight: isActive ? "bold" : "normal",
          color: isActive ? "#007bff" : "#555",
        })}
      >
        待办
      </NavLink>
      <NavLink
        to="/completed"
        style={({ isActive }) => ({
          ...linkStyle,
          fontWeight: isActive ? "bold" : "normal",
          color: isActive ? "#007bff" : "#555",
        })}
      >
        已完成
      </NavLink>
      <NavLink
        to="/about"
        style={({ isActive }) => ({
          ...linkStyle,
          fontWeight: isActive ? "bold" : "normal",
          color: isActive ? "#007bff" : "#555",
        })}
      >
        关于
      </NavLink>
    </nav>
  );
};

export default Navbar;
