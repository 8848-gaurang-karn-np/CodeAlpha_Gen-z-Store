import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", countryCode: "+977", phone: "", password: "", role: "consumer" });
  const [authMethod, setAuthMethod] = useState("email"); 
  const [step, setStep] = useState(1); 
  const [otpCode, setOtpCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const fetchSuggestedPassword = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/suggest-password");
      setFormData({ ...formData, password: res.data.suggestedPassword });
      navigator.clipboard.writeText(res.data.suggestedPassword);
      setMessage("🔐 Suggested password synchronized to clipboard!");
    } catch {
      setFormData({ ...formData, password: Math.random().toString(36).slice(-8) + "X!9a" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authMethod === "phone" && formData.phone.length !== 10) {
      setMessage("❌ Error: Phone string parameter length must equal exactly 10 digits.");
      return;
    }
    setMessage("Sending request...");
    try {
      const finalPhone = authMethod === "phone" ? `${formData.countryCode}${formData.phone}` : "";
      const payload = { ...formData, phone: finalPhone, authMethod };
      const res = await axios.post("http://localhost:5000/api/auth/register", payload);
      setMessage(res.data.message);
      setStep(2); 
    } catch (err) {
      if (err.response) {
        setMessage(`❌ Server Error (${err.response.status}): ${err.response.data?.message || JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        setMessage("❌ Network Error: Backend server on Port 5000 is offline or blocked by CORS!");
      } else {
        setMessage(`❌ Request Error: ${err.message}`);
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const finalPhone = authMethod === "phone" ? `${formData.countryCode}${formData.phone}` : "";
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email: formData.email, phone: finalPhone, otpCode, authMethod });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      setMessage("🎉 Token verification complete! Access authorized.");
      setTimeout(() => navigate("/products"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired authorization code.");
    }
  };

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", fontFamily: "Arial", padding: "20px" }}>
      <div style={{ backgroundColor: "#1e293b", padding: "40px", borderRadius: "12px", width: "100%", maxWidth: "420px", border: "1px solid #334155" }}>
        {step === 1 ? (
          <>
            <h2 style={{ textAlign: "center", color: "#38bdf8", marginBottom: "20px" }}>Create Profile</h2>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button type="button" onClick={() => setAuthMethod("email")} style={{ flex: 1, padding: "10px", background: authMethod === "email" ? "#0284c7" : "#0f172a", border: "1px solid #334155", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Email</button>
              <button type="button" onClick={() => setAuthMethod("phone")} style={{ flex: 1, padding: "10px", background: authMethod === "phone" ? "#0284c7" : "#0f172a", border: "1px solid #334155", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Phone</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label>Full Name</label>
                <input type="text" name="name" required onChange={handleChange} style={{ width: "100%", padding: "10px", marginTop: "5px", backgroundColor: "#0f172a", border: "1px solid #475569", borderRadius: "6px", color: "#fff", boxSizing: "border-box" }} />
              </div>

              {authMethod === "email" ? (
                <div style={{ marginBottom: "15px" }}>
                  <label>Email Address</label>
                  <input type="email" name="email" required onChange={handleChange} style={{ width: "100%", padding: "10px", marginTop: "5px", backgroundColor: "#0f172a", border: "1px solid #475569", borderRadius: "6px", color: "#fff", boxSizing: "border-box" }} />
                </div>
              ) : (
                <div style={{ marginBottom: "15px" }}>
                  <label>Phone Number</label>
                  <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                    <select name="countryCode" value={formData.countryCode} onChange={handleChange} style={{ width: "35%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #475569", borderRadius: "6px", color: "#38bdf8", fontWeight: "bold" }}>
                      <option value="+977">🇳🇵 +977</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                    </select>
                    <input type="tel" name="phone" maxLength="10" placeholder="XXXXXXXXXX" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })} style={{ flex: 1, padding: "10px", backgroundColor: "#0f172a", border: "1px solid #475569", borderRadius: "6px", color: "#fff", boxSizing: "border-box" }} />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label>Password</label>
                  <button type="button" onClick={fetchSuggestedPassword} style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>✨ Suggest Password</button>
                </div>
                <input type="text" name="password" value={formData.password} required onChange={handleChange} style={{ width: "100%", padding: "10px", marginTop: "5px", backgroundColor: "#0f172a", border: "1px solid #475569", borderRadius: "6px", color: "#fff", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label>Account Type</label>
                <select name="role" value={formData.role} onChange={handleChange} style={{ width: "100%", padding: "10px", marginTop: "5px", backgroundColor: "#0f172a", border: "1px solid #475569", borderRadius: "6px", color: "#38bdf8", fontWeight: "bold" }}>
                  <option value="consumer">🛍️ Consumer (Buy Items)</option>
                  <option value="client">🏢 Client (Add & Manage Products)</option>
                </select>
              </div>
              <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Send Verification Code 📩</button>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerify}>
            <h2 style={{ textAlign: "center", color: "#38bdf8" }}>Enter Verification Code</h2>
            <input type="text" maxLength="6" placeholder="000000" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "#0f172a", border: "1px solid #38bdf8", borderRadius: "8px", color: "#fff", fontSize: "24px", textAlign: "center", letterSpacing: "6px", margin: "20px 0" }} />
            <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#0284c7", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Verify & Activate Account</button>
          </form>
        )}
        {message && <p style={{ textAlign: "center", marginTop: "15px", color: message.includes("❌") ? "#ef4444" : "#10b981", fontWeight: "bold" }}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;