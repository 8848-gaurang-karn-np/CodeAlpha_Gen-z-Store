import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // FIXED: The async function is now properly wrapped inside the useEffect
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/services/wishlist", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlistItems(res.data.products || []);
      } catch (err) {
        console.error("Wishlist load error", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/services/wishlist/toggle", { productId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove item from UI instantly
      setWishlistItems(wishlistItems.filter(item => item._id !== productId));
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading Wishlist...</div>;

  return (
    <div style={{ padding: "40px 8%", backgroundColor: "#f1f3f6", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#212121", marginBottom: "20px" }}>My Wishlist ({wishlistItems.length})</h2>
      
      {wishlistItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", backgroundColor: "#fff", borderRadius: "4px" }}>
          <h3>Your wishlist is empty!</h3>
          <p>Save items you like here to buy them later.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {wishlistItems.map((item) => (
            <div key={item._id} style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", padding: "15px", display: "flex", flexDirection: "column" }}>
              <img src={item.image} alt={item.name} style={{ height: "150px", objectFit: "contain", marginBottom: "15px" }} />
              <h4 style={{ margin: "0 0 10px 0" }}>{item.name}</h4>
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 15px 0" }}>${item.price}</p>
              
              <div style={{ marginTop: "auto", display: "flex", gap: "10px" }}>
                <button onClick={() => addToCart(item)} style={{ flex: 1, padding: "10px", backgroundColor: "#ff9f00", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>Add to Cart</button>
                <button onClick={() => handleRemove(item._id)} style={{ padding: "10px", backgroundColor: "#fff", border: "1px solid #d7d7d7", cursor: "pointer" }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;