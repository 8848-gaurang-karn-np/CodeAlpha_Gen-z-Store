import { useEffect, useState } from "react";
import axios from "axios"; 

const ClientOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders/client-dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Dashboard pull failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
    } catch (err) {
      console.error(err);
      alert("Fulfillment manipulation error.");
    }
  };

  if (loading) return <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>Loading incoming sales streams...</div>;

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", padding: "40px 20px", color: "#fff", fontFamily: "Arial" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ color: "#10b981", marginBottom: "30px", fontWeight: "800" }}>🏢 Fulfillment Center Dashboard</h1>
        
        {orders.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No consumer transactions logged in system cache yet.</p>
        ) : (
          orders.map(order => (
            <div key={order._id} style={{ backgroundColor: "#1e293b", padding: "25px", borderRadius: "16px", border: "1px solid #334155", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", borderBottom: "1px solid #334155", paddingBottom: "15px", marginBottom: "15px" }}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0", color: "#38bdf8" }}>Buyer: {order.user?.name || "Unknown Profile"}</h4>
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>Contact: {order.user?.email} | {order.user?.phone || "No Phone Passed"}</p>
                  <p style={{ margin: "5px 0 0 0", color: "#cbd5e1", fontSize: "14px" }}><b>Ship To:</b> {order.shippingAddress}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981", display: "block" }}>${order.totalAmount.toFixed(2)}</span>
                  <label style={{ fontSize: "12px", color: "#94a3b8", marginRight: "10px" }}>Fulfillment status:</label>
                  <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} style={{ padding: "6px", backgroundColor: "#0f172a", border: "1px solid #475569", borderRadius: "6px", color: "#38bdf8", fontWeight: "bold" }}>
                    <option value="Pending">⏳ Pending</option>
                    <option value="Processing">⚙️ Processing</option>
                    <option value="Shipped">📦 Shipped</option>
                    <option value="Delivered">✅ Delivered</option>
                  </select>
                </div>
              </div>
              <div>
                {order.items.map((item, idx) => (
                  <p key={idx} style={{ margin: "5px 0", color: "#94a3b8", fontSize: "14px" }}>• {item.name} <b style={{ color: "#fff" }}>x{item.quantity}</b> — (${item.price})</p>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientOrders;