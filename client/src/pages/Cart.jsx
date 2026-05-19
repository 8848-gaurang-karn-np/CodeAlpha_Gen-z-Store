import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const context = useContext(CartContext);
  const navigate = useNavigate();

  if (!context) {
    return (
      <div style={{ minHeight: "calc(100vh - 70px)", backgroundColor: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", color: "#38bdf8" }}>
        <h3>Initializing Secure Shopping Vault...</h3>
      </div>
    );
  }

  // Extract variables and functions
  const { cart, cartItems, removeFromCart, removeFromCartItems, updateQuantity, updateCartQty, setCart } = context;

  // Resolve cart item array mapping
  const safeCartItems = cartItems || cart || [];

  // 🌟 Adaptive Quantity State Modifier Engine
  const handleQtyChange = (productId, currentQty, targetQty) => {
    if (targetQty < 1) return;
    
    // 1. Check if context uses 'updateQuantity'
    if (updateQuantity) {
      updateQuantity(productId, targetQty);
    } 
    // 2. Check if context uses 'updateCartQty'
    else if (updateCartQty) {
      updateCartQty(productId, targetQty);
    } 
    // 3. Fallback: If context exposed direct state modifier 'setCart'
    else if (setCart) {
      const updated = safeCartItems.map(item => 
        item._id === productId ? { ...item, quantity: targetQty } : item
      );
      setCart(updated);
    }
  };

  // 🌟 Adaptive Item Removal Trigger
  const handleItemRemoval = (productId) => {
    if (removeFromCart) removeFromCart(productId);
    else if (removeFromCartItems) removeFromCartItems(productId);
    else if (setCart) {
      setCart(safeCartItems.filter(item => item._id !== productId));
    }
  };

  // Calculate subtotal calculations
  const cartTotal = safeCartItems
    .reduce((total, item) => total + (Number(item?.price || 0) * Number(item?.quantity || 0)), 0)
    .toFixed(2);

  return (
    <div style={{ minHeight: "calc(100vh - 70px)", backgroundColor: "#0f172a", padding: "40px 5%", fontFamily: "'Inter', sans-serif", color: "#f8fafc" }}>
      
      <style>{`
        .cart-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 380px; gap: 30px; }
        @media (max-width: 900px) { .cart-container { grid-template-columns: 1fr; } }
        
        .cart-items-card { background: #1e293b; border-radius: 12px; padding: 30px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .cart-item { display: flex; align-items: center; gap: 20px; padding: 20px 0; border-bottom: 1px solid #334155; }
        .cart-item:last-child { border-bottom: none; padding-bottom: 0; }
        
        .item-img { width: 100px; height: 100px; object-fit: contain; background: #fff; border-radius: 8px; padding: 5px; }
        .item-details { flex-grow: 1; }
        .item-title { font-size: 18px; font-weight: 700; color: #f8fafc; margin: 0 0 8px 0; }
        .item-price { font-size: 16px; font-weight: 700; color: #38bdf8; margin: 0 0 12px 0; }
        
        .qty-controls { display: flex; align-items: center; gap: 10px; }
        .qty-btn { background: #334155; color: #fff; border: none; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background 0.2s; }
        .qty-btn:hover { background: #475569; }
        .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .remove-btn { color: #f87171; background: none; border: none; cursor: pointer; font-size: 14px; font-weight: bold; margin-left: auto; transition: color 0.2s; }
        .remove-btn:hover { color: #ef4444; text-decoration: underline; }

        .summary-card { background: #1e293b; border-radius: 12px; padding: 30px; border: 1px solid #334155; height: fit-content; position: sticky; top: 100px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; color: #94a3b8; font-size: 15px; }
        .summary-total { display: flex; justify-content: space-between; margin-top: 20px; padding-top: 20px; border-top: 1px solid #334155; color: #fff; font-size: 20px; font-weight: 800; }
        
        .checkout-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #38bdf8, #0284c7); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 25px; transition: transform 0.2s, box-shadow 0.2s; }
        .checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(56, 189, 248, 0.3); }
      `}</style>

      <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span>🛒</span> Shopping Cart Dashboard
      </h1>

      {safeCartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", background: "#1e293b", borderRadius: "12px", border: "1px solid #334155" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📦</div>
          <h2 style={{ fontSize: "24px", marginBottom: "15px" }}>Your cart is empty</h2>
          <p style={{ color: "#94a3b8", marginBottom: "25px" }}>Looks like you haven't assigned items to your active collection sequence yet.</p>
          <Link to="/products" style={{ display: "inline-block", padding: "12px 24px", background: "#38bdf8", color: "#0f172a", textDecoration: "none", borderRadius: "6px", fontWeight: "bold" }}>
            Return to Storefront Catalog
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items-card">
            {safeCartItems.map((item, index) => (
              <div key={item?._id || index} className="cart-item">
                <img src={item?.image} alt={item?.name} className="item-img" />
                <div className="item-details">
                  <h3 className="item-title">{item?.name}</h3>
                  <p className="item-price">${item?.price}</p>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => handleQtyChange(item._id, item.quantity, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span style={{ fontWeight: "bold", width: "20px", textAlign: "center" }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => handleQtyChange(item._id, item.quantity, item.quantity + 1)}>+</button>
                    <button className="remove-btn" onClick={() => handleItemRemoval(item._id)}>Remove Item</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-card">
            <h2 style={{ fontSize: "20px", marginBottom: "25px", borderBottom: "1px solid #334155", paddingBottom: "15px" }}>Order Specifications</h2>
            <div className="summary-row">
              <span>Selected Products ({safeCartItems.length}):</span>
              <span>${cartTotal}</span>
            </div>
            <div className="summary-row">
              <span>Logistics Delivery Fee:</span>
              <span style={{ color: "#34d399" }}>Free Priority</span>
            </div>
            <div className="summary-total">
              <span>Aggregate Total:</span>
              <span>${cartTotal}</span>
            </div>
            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to Verification ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;