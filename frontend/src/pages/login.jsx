import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");

    if (email === savedEmail && password === savedPassword) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/"); // Login ke baad Home par jao taaki analyzer dikhe
      window.location.reload(); // Navbar update karne ke liye refresh
    } else {
      alert("Invalid Email or Password!");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, #1e3a8a, #020617)", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "#1e293b", padding: "40px", borderRadius: "20px", width: "400px", textAlign: "center", border: "1px solid #334155" }}>
        <h1 style={{ color: "white", marginBottom: "30px" }}>Welcome Back 👋</h1>
        
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ width: "100%", padding: "14px", marginBottom: "20px", borderRadius: "10px", border: "none", outline: "none" }} 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ width: "100%", padding: "14px", marginBottom: "20px", borderRadius: "10px", border: "none", outline: "none" }} 
        />
        
        <button onClick={handleLogin} style={{ width: "100%", padding: "14px", border: "none", borderRadius: "10px", background: "#38bdf8", color: "#0b1120", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
          Login
        </button>
        
        <p style={{ color: "#94a3b8", marginTop: "20px" }}>
          Don't have an account? <Link to="/signup" style={{ color: "#38bdf8", textDecoration: "none" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;