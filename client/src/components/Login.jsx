import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role); 
      setMessage("Welcome back! Redirecting...");
      setTimeout(() => navigate("/products"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials configuration.");
    }
  };

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", fontFamily: "Arial" }}>
      <div style={{ backgroundColor: "#1e293b", padding: "40px", borderRadius: "12px", width: "100%", maxWidth: "400px", border: "1px solid #334155" }}>
        <h2 style={{ textAlign: "center", color: "#38bdf8", marginBottom: "20px" }}>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email or Phone Number</label>
            <input type="text" name="emailOrPhone" required onChange={handleChange} style={{ width: "100%", padding: "10px", marginTop: "5px", backgroundColor: "#0f172a", border: "1px solid #475569", borderRadius: "6px", color: "#fff", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>Password</label>
            <input type="password" name="password" required onChange={handleChange} style={{ width: "100%", padding: "10px", marginTop: "5px", backgroundColor: "#0f172a", border: "1px solid #475569", borderRadius: "6px", color: "#fff", boxSizing: "border-box" }} />
          </div>
          <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#0284c7", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold" }}>Sign In</button>
        </form>
        {message && <p style={{ textAlign: "center", marginTop: "15px", color: message.includes("Welcome") ? "#10b981" : "#ef4444", fontWeight: "bold" }}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;