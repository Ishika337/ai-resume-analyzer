import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("isLoggedIn");

    navigate("/login");

    window.location.reload();
  };

  return (

    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 50px",
        background: "#0f172a",
      }}
    >

      <h2 style={{ color: "#38bdf8" }}>
        AI Career Copilot 🚀
      </h2>

      <div style={{ display: "flex", gap: "20px" }}>

        <Link to="/" style={linkStyle}>
          Home
        </Link>

        <Link to="/about" style={linkStyle}>
          About
        </Link>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            border: "none",
            padding: "10px 20px",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none"
};