import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:5000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Order sync transaction dashboard crash log:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: "calc(100vh - 70px)", backgroundColor: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", color: "#38bdf8" }}>
        <h3>Decrypting Transaction Databases...</h3>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 70px)", backgroundColor: "#0f172a", padding: "40px 6%", fontFamily: "'Inter', sans-serif", color: "#f8fafc" }}>
      
      <style>{`
        .order-history-card { background: #1e293b; border-radius: 12px; padding: 25px; border: 1px solid #334155; margin-bottom: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
        .order-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 15px; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .order-meta-group { display: flex; gap: 30px; }
        .meta-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .meta-value { font-size: 14px; font-weight: 600; color: #f8fafc; }
        
        .order-status-badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2); }
        
        .order-item-row { display: flex; align-items: center; gap: 20px; padding: 15px 0; border-bottom: 1px solid rgba(51, 65, 85, 0.4); }
        .order-item-row:last-child { border-bottom: none; }
        .order-item-img { width: 70px; height: 70px; object-fit: contain; background: #fff; border-radius: 6px; padding: 4px; }
        .order-item-info { flex-grow: 1; }
        
        .btn-catalog-return { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #38bdf8, #0284c7); color: #0f172a; font-weight: bold; text-decoration: none; border-radius: 6px; transition: all 0.2s; }
        .btn-catalog-return:hover { opacity: 0.95; transform: translateY(-1px); }
      `}</style>

      <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span>📦</span> Order Registry Tracking
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", background: "#1e293b", borderRadius: "12px", border: "1px solid #334155" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📭</div>
          <h2 style={{ fontSize: "24px", marginBottom: "15px" }}>No Transactions Documented</h2>
          <p style={{ color: "#94a3b8", marginBottom: "25px" }}>You haven't dispatched any active checkout requests to this profile session.</p>
          <Link to="/products" className="btn-catalog-return">Explore Catalog Infrastructure</Link>
        </div>
      ) : (
        <div style={{ maxWidth: "950px", margin: "0 auto" }}>
          {orders.map((order) => (
            <div key={order._id} className="order-history-card">
              
              <div className="order-header">
                <div className="order-meta-group">
                  <div>
                    <div className="meta-label">Date Placed</div>
                    <div className="meta-value">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="meta-label">Aggregate Cost</div>
                    <div className="meta-value" style={{ color: "#38bdf8" }}>${order.total.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="meta-label">Tracking ID</div>
                    <div className="meta-value" style={{ fontFamily: "monospace", color: "#cbd5e1" }}>{order._id}</div>
                  </div>
                </div>
                <div className="order-status-badge">
                  📍 {order.status}
                </div>
              </div>

              {/* Product Sub-list */}
              <div className="order-items-container">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <img src={item.image} alt={item.name} className="order-item-img" />
                    <div className="order-item-info">
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600" }}>{item.name}</h4>
                      <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
                        Quantity Selection: <span style={{ color: "#f8fafc", fontWeight: "bold" }}>{item.quantity}</span> &bull; Unit Value: <span style={{ color: "#34d399" }}>${item.price}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;