import { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", stock: "", category: "", image: ""
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Product successfully deployed to live storefront!");
      setIsError(false);
      setFormData({ name: "", description: "", price: "", stock: "", category: "", image: "" }); // Reset form
    } catch (err) {
      setMessage(`❌ Upload failed: ${err.response?.data?.message || err.message}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 70px)", display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 20px", background: "#0f172a", fontFamily: "'Segoe UI', sans-serif" }}>
      
      <style>{`
        .admin-form-card { background: #1e293b; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 100%; max-width: 600px; border: 1px solid #334155; }
        .input-group { margin-bottom: 20px; }
        .input-label { display: block; margin-bottom: 8px; color: #94a3b8; font-size: 14px; font-weight: 600; }
        .admin-input { width: 100%; padding: 12px 15px; border-radius: 6px; border: 1px solid #475569; background-color: #0f172a; color: #f8fafc; font-size: 15px; transition: all 0.3s; outline: none; }
        .admin-input:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2); }
        .admin-submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #2874f0, #38bdf8); color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.3s; margin-top: 10px; }
        .admin-submit-btn:hover { background: linear-gradient(135deg, #1a62d6, #0284c7); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(56, 189, 248, 0.4); }
        .admin-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }
      `}</style>

      <div className="admin-form-card">
        <h2 style={{ color: "#f8fafc", marginBottom: "8px", fontSize: "28px", textAlign: "center" }}>Seller Workspace</h2>
        <p style={{ color: "#64748b", textAlign: "center", marginBottom: "30px", fontSize: "14px" }}>Deploy new inventory to the Gen Z Store catalog.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Product Title</label>
            <input type="text" className="admin-input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Sony WH-1000XM5" />
          </div>

          <div className="input-group">
            <label className="input-label">Detailed Description</label>
            <textarea className="admin-input" required rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter product features and specs..." />
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Price (USD)</label>
              <input type="number" className="admin-input" required min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Initial Stock</label>
              <input type="number" className="admin-input" required min="1" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="100" />
            </div>
          </div>

          {/* FIX: This dropdown strictly matches the Database Enum rules! */}
          <div className="input-group">
            <label className="input-label">Catalog Category</label>
            <select className="admin-input" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              <option value="" disabled>Select exact category mapping...</option>
              <option value="Fashion">Fashion</option>
              <option value="Mobiles">Mobiles</option>
              <option value="Beauty">Beauty</option>
              <option value="Electronics">Electronics</option>
              <option value="Home">Home</option>
              <option value="Appliances">Appliances</option>
              <option value="Toys">Toys</option>
              <option value="Food & Health">Food & Health</option>
              <option value="Auto Accessories">Auto Accessories</option>
              <option value="2 Wheelers">2 Wheelers</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Image URL</label>
            <input type="url" className="admin-input" required value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
          </div>

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? "Deploying to Database..." : "🚀 Upload to Storefront"}
          </button>
        </form>

        {message && (
          <div style={{ marginTop: "20px", padding: "15px", borderRadius: "6px", backgroundColor: isError ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)", color: isError ? "#f87171" : "#4ade80", border: `1px solid ${isError ? "#ef4444" : "#22c55e"}`, textAlign: "center", fontWeight: "bold" }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;