import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api/api"; 
import { CartContext } from "../context/CartContext";
import CategoryRibbon from "../components/CategoryRibbon";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🌟 NEW: Track wishlist items locally
  const [wishlist, setWishlist] = useState([]); 
  const { addToCart } = useContext(CartContext);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCatalogData = async () => {
      setLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const category = searchParams.get("category") || "";
      const search = searchParams.get("search") || "";

      let queryPath = "/products?";
      if (category) queryPath += `category=${encodeURIComponent(category)}&`;
      if (search) queryPath += `search=${encodeURIComponent(search)}`;

      try {
        // 1. Fetch Products
        const prodRes = await API.get(queryPath);
        setProducts(prodRes.data);

        // 2. Fetch User's current wishlist if logged in (so hearts stay red!)
        const token = localStorage.getItem("token");
        if (token) {
          const wishRes = await axios.get("http://localhost:5000/api/services/wishlist", {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Extract just the IDs of the products in the wishlist
          const wishIds = wishRes.data.products.map(p => p._id);
          setWishlist(wishIds);
        }
      } catch (err) {
        console.error("Catalog sync failure:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogData();
  }, [location.search]);

  // 🌟 NEW: Wishlist Toggle Function
  const handleWishlistToggle = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to save items to your wishlist!");
      return navigate("/login");
    }

    // Optimistic UI Update (makes the heart turn red instantly before server replies)
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }

    try {
      await axios.post("http://localhost:5000/api/services/wishlist/toggle", { productId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Wishlist sync error:", err);
      // Revert if server fails (optional, but good practice)
    }
  };

  const handleCategorySelection = (categoryName) => {
    const searchParams = new URLSearchParams(location.search);
    const currentSearch = searchParams.get("search") || "";

    if (categoryName) searchParams.set("category", categoryName);
    else searchParams.delete("category");

    if (currentSearch) searchParams.set("search", currentSearch);
    navigate(`/products?${searchParams.toString()}`);
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", color: "#000", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <CategoryRibbon onSelectCategory={handleCategorySelection} />

      <style>{`
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px; max-width: 1300px; margin: 0 auto; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .product-card { 
          position: relative; /* Needed for absolute positioning of heart */
          background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; 
          overflow: hidden; display: flex; flex-direction: column; 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          animation: fadeInUp 0.5s ease-out both; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .product-card:hover { transform: translateY(-8px); border-color: #38bdf8; box-shadow: 0 20px 40px rgba(40, 116, 240, 0.12), 0 0 20px rgba(56, 189, 248, 0.2); z-index: 10; }

        .img-container { width: 100%; height: 240px; background-color: #ffffff; display: flex; align-items: center; justify-content: center; padding: 20px; overflow: hidden; }
        .product-img { max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.5s ease; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1)); }
        .product-card:hover .product-img { transform: scale(1.1); } 

        .card-content { padding: 20px; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1; border-top: 1px solid #f1f5f9; background: #fafafa; }
        .product-title { margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: color 0.2s; }
        .product-card:hover .product-title { color: #2874f0; }
        .product-desc { color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 15px 0; height: 38px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        
        .cart-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #ff9f00, #f39200); color: white; border: none; border-radius: 6px; font-weight: bold; font-size: 15px; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 10px rgba(255, 159, 0, 0.3); }
        .cart-btn:hover { background: linear-gradient(135deg, #f39200, #e68a00); box-shadow: 0 6px 15px rgba(255, 159, 0, 0.4); transform: translateY(-2px); }
        .cart-btn:active { transform: translateY(0); box-shadow: 0 2px 5px rgba(255, 159, 0, 0.4); }

        /* 🌟 NEW: Floating Heart Button CSS */
        .wishlist-btn {
          position: absolute; top: 15px; right: 15px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #e2e8f0; border-radius: 50%;
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s;
          z-index: 20;
        }
        .wishlist-btn:hover { transform: scale(1.15); background: #ffffff; }
        .wishlist-btn:active { transform: scale(0.9); }
        .wished { animation: heartPop 0.3s ease-out; }
        @keyframes heartPop { 0% { transform: scale(1); } 50% { transform: scale(1.4); } 100% { transform: scale(1); } }

        /* 🌟 NEW: Skeleton Loader CSS */
        .skeleton { background: #e2e8f0; border-radius: 4px; animation: skeleton-loading 1s linear infinite alternate; }
        @keyframes skeleton-loading { 0% { background-color: #e2e8f0; } 100% { background-color: #cbd5e1; } }
      `}</style>

      <div style={{ padding: "35px 8%" }}>
        {loading ? (
          /* Dynamic Skeleton Loading Grid */
          <div className="product-grid">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="product-card" style={{ height: "420px" }}>
                <div className="skeleton" style={{ height: "240px", width: "100%", borderRadius: "12px 12px 0 0" }}></div>
                <div className="card-content">
                  <div className="skeleton" style={{ height: "20px", width: "80%", marginBottom: "10px" }}></div>
                  <div className="skeleton" style={{ height: "15px", width: "100%", marginBottom: "5px" }}></div>
                  <div className="skeleton" style={{ height: "15px", width: "60%", marginBottom: "20px" }}></div>
                  <div className="skeleton" style={{ height: "40px", width: "100%" }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>🔍</div>
            <h3 style={{ color: "#1e293b", margin: "0 0 10px 0", fontSize: "22px" }}>No Matching Products Found</h3>
            <p style={{ color: "#64748b", margin: 0 }}>Try refining your search text or switching options on the category ribbon tracker.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product, index) => {
              const isWished = wishlist.includes(product._id);
              
              return (
                <div key={product._id} className="product-card" style={{ animationDelay: `${index * 0.05}s` }}>
                  
                  {/* 🌟 NEW: The Wishlist Overlay Button */}
                  <button 
                    onClick={() => handleWishlistToggle(product._id)} 
                    className={`wishlist-btn ${isWished ? 'wished' : ''}`}
                    title="Toggle Wishlist"
                  >
                    {isWished ? "❤️" : "🤍"}
                  </button>

                  <div className="img-container">
                    <img src={product.image} alt={product.name} className="product-img" />
                  </div>
                  
                  <div className="card-content">
                    <div>
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-desc">{product.description}</p>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <span style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>${product.price}</span>
                        <span style={{ fontSize: "11px", padding: "4px 8px", backgroundColor: "#10b981", color: "white", borderRadius: "20px", fontWeight: "bold", letterSpacing: "0.5px" }}>
                          {product.category}
                        </span>
                      </div>
                      <button onClick={() => addToCart(product)} className="cart-btn">🛒 Add to Cart</button>
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;