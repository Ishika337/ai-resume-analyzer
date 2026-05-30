import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }
    // Temporary storage for login check
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);
    
    alert("Signup Successful! Now please login.");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, #1e3a8a, #020617)", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "#1e293b", padding: "40px", borderRadius: "20px", width: "400px", textAlign: "center", border: "1px solid #334155" }}>
        <h1 style={{ color: "white", marginBottom: "30px" }}>Create Account 🚀</h1>
        
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
        
        <button onClick={handleSignup} style={{ width: "100%", padding: "14px", border: "none", borderRadius: "10px", background: "#22c55e", color: "white", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
          Sign Up
        </button>
        
        <p style={{ color: "#94a3b8", marginTop: "20px" }}>
          Already have an account? <Link to="/login" style={{ color: "#38bdf8", textDecoration: "none" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;