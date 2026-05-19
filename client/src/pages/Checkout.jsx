import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";

const Checkout = () => {
  const context = useContext(CartContext);
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState({
    street: "", city: "", state: "", zipCode: "", phone: ""
  });
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-fetch saved profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:5000/api/services/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data?.user && res.data.user.address) {
          setShippingInfo({
            street: res.data.user.address.street || "",
            city: res.data.user.address.city || "",
            state: res.data.user.address.state || "",
            zipCode: res.data.user.address.zipCode || "",
            phone: res.data.user.phone || ""
          });
        }
      } catch (err) {
        console.error("Failed to load user data for checkout:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  // 🛡️ Safety Check 1: Handle uninitialized context safely
  if (!context) {
    return <div style={{ color: "#38bdf8", textAlign: "center", marginTop: "100px" }}>Connecting to Checkout Gateway...</div>;
  }

  const { cart, cartItems, clearCart } = context;

  // 🛡️ Safety Check 2: Adapt cleanly to your context's native naming architecture
  const safeCartItems = cartItems || cart || [];

  // Calculate grand total safely
  const cartTotal = safeCartItems
    .reduce((total, item) => total + (Number(item?.price || 0) * Number(item?.quantity || 0)), 0)
    .toFixed(2);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      
      // 🚀 Dispatch real order logs directly to MongoDB cluster
      await axios.post("http://localhost:5000/api/orders", {
        items: safeCartItems,
        total: cartTotal,
        shippingAddress: shippingInfo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("🎉 Order Processed and Tracked and Logs Locked!");
      if (clearCart) clearCart(); 
      navigate("/orders"); 
    } catch (err) {
      console.error("Checkout database tracking injection failure:", err);
      alert("Checkout sync failed. Please review network response logs.");
      setIsProcessing(false);
    }
  };
  
  if (loading) return <div style={{ color: "#38bdf8", textAlign: "center", marginTop: "100px" }}>Loading Checkout Parameters...</div>;

  return (
    <div style={{ minHeight: "calc(100vh - 70px)", backgroundColor: "#0f172a", padding: "40px 5%", fontFamily: "'Inter', sans-serif", color: "#f8fafc" }}>
      
      <style>{`
        .checkout-grid { display: grid; grid-template-columns: 1fr 400px; gap: 30px; max-width: 1200px; margin: 0 auto; }
        @media (max-width: 900px) { .checkout-grid { grid-template-columns: 1fr; } }
        .checkout-card { background: #1e293b; border-radius: 12px; padding: 30px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .input-group { margin-bottom: 20px; }
        .input-label { display: block; margin-bottom: 8px; color: #94a3b8; font-size: 14px; font-weight: 600; }
        .form-input { width: 100%; padding: 12px 15px; border-radius: 6px; border: 1px solid #475569; background-color: #0f172a; color: #f8fafc; font-size: 15px; outline: none; transition: border-color 0.2s; }
        .form-input:focus { border-color: #38bdf8; }
        .pay-btn { width: 100%; padding: 16px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; margin-top: 20px; transition: all 0.2s; }
        .pay-btn:hover { background: #059669; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3); }
        .pay-btn:disabled { background: #475569; cursor: not-allowed; box-shadow: none; }
        .back-nav-link { color: #38bdf8; text-decoration: none; font-size: 14px; display: inline-block; margin-bottom: 20px; font-weight: 600; transition: color 0.2s; }
        .back-nav-link:hover { color: #7dd3fc; text-decoration: underline; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* 🌟 Fixed Back Navigation Action */}
        <button onClick={() => navigate("/cart")} className="back-nav-link" style={{ background: "none", border: "none", cursor: "pointer" }}>
          ⬅️ Return to Shopping Cart
        </button>
      </div>

      <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "30px", textAlign: "center" }}>Secure Checkout Gateway</h1>

      <form onSubmit={handlePlaceOrder} className="checkout-grid">
        <div className="checkout-card">
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>1. Shipping Address</h2>
          
          <div className="input-group">
            <label className="input-label">Street Address</label>
            <input type="text" required className="form-input" value={shippingInfo.street} onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})} />
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div className="input-group">
              <label className="input-label">City</label>
              <input type="text" required className="form-input" value={shippingInfo.city} onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="input-label">State</label>
              <input type="text" required className="form-input" value={shippingInfo.state} onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div className="input-group">
              <label className="input-label">ZIP / Postal Code</label>
              <input type="text" required className="form-input" value={shippingInfo.zipCode} onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="input-label">Contact Phone</label>
              <input type="text" required className="form-input" value={shippingInfo.phone} onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="checkout-card" style={{ height: "fit-content" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>2. Payment Summary</h2>
          
          <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "20px" }}>
            {safeCartItems.map((item, index) => (
              <div key={item?._id || index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                <span>{item?.quantity}x {item?.name?.substring(0, 20)}...</span>
                <span>${(Number(item?.price || 0) * Number(item?.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "22px", fontWeight: "bold", borderTop: "1px solid #334155", paddingTop: "20px", marginBottom: "20px" }}>
            <span>Total to Pay:</span>
            <span style={{ color: "#38bdf8" }}>${cartTotal}</span>
          </div>

          <button type="submit" className="pay-btn" disabled={isProcessing || safeCartItems.length === 0}>
            {isProcessing ? "Processing Order..." : "🔒 Confirm & Pay"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;