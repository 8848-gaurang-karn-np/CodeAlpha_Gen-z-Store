import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { getTotalItems } = useContext(CartContext);
  const isLoggedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLightMode, setIsLightMode] = useState(() => localStorage.getItem("neoTheme") === "light");

  const loginRef = useRef(null);
  const moreRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) setShowLoginDropdown(false);
      if (moreRef.current && !moreRef.current.contains(event.target)) setShowMoreDropdown(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add("light-mode");
      localStorage.setItem("neoTheme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("neoTheme", "dark");
    }
  }, [isLightMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim();
    if (cleanQuery) navigate(`/products?search=${encodeURIComponent(cleanQuery)}`);
    else navigate("/products");
  };

  const handleLanguageChange = (langKey) => {
    i18n.changeLanguage(langKey);
    localStorage.setItem("neoLanguage", langKey);
  };

  return (
    <header className="neo-modern-header">
      <style>{`
        /* ✨ Unique Cyber-Minimalist Custom Design */
        .neo-modern-header { 
          width: 100%; 
          position: sticky; 
          top: 0; 
          z-index: 1000; 
          font-family: 'Inter', system-ui, -apple-system, sans-serif; 
          background: rgba(15, 23, 42, 0.9); /* Translucent Slate */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(51, 65, 85, 0.5);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); 
        }
        .nav-container { padding: 14px 6%; display: flex; align-items: center; justify-content: space-between; gap: 30px; }
        
        /* Neon Branding */
        .brand-logo { 
          color: #fff; 
          text-decoration: none; 
          font-size: 24px; 
          font-weight: 900; 
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #38bdf8, #0284c7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: transform 0.2s ease;
        }
        .brand-logo:hover { transform: scale(1.03); }
        
        /* High-Visibility Custom Search Bar */
        .search-box { position: relative; width: 100%; max-width: 550px; display: flex; flex: 1; }
        .search-input { 
          width: 100%; 
          padding: 11px 50px 11px 18px; 
          border-radius: 8px; 
          border: 1px solid #334155; 
          outline: none; 
          font-size: 14px; 
          color: #fff; 
          background: rgba(30, 41, 59, 0.7);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .search-input:focus { 
          border-color: #38bdf8; 
          background: rgba(30, 41, 59, 0.9);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
        }
        .search-input::placeholder { color: #64748b; }
        .search-btn { 
          position: absolute; 
          right: 0; top: 0; bottom: 0; 
          background: linear-gradient(135deg, #38bdf8, #0284c7); 
          color: white;
          border: none; 
          cursor: pointer; 
          font-size: 16px; 
          width: 48px; 
          border-radius: 0 8px 8px 0; 
          transition: opacity 0.2s; 
        }
        .search-btn:hover { opacity: 0.9; }

        /* Action Nav Elements */
        .nav-actions { display: flex; align-items: center; gap: 28px; }
        .nav-item-link { color: #f1f5f9; text-decoration: none; display: flex; flex-direction: column; cursor: pointer; user-select: none; transition: color 0.2s; }
        .nav-item-link:hover { color: #38bdf8; }
        .nav-subtext { font-size: 11px; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 2px; }
        .nav-maintext { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
        
        /* Glassmorphism Megamenu Panels */
        @keyframes menuFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .mega-drop-menu { 
          position: absolute; 
          top: calc(100% + 14px); 
          right: -40px; 
          background: #1e293b; 
          border-radius: 12px; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.4); 
          width: 440px; 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          padding: 24px; 
          z-index: 1001; 
          border: 1px solid #334155; 
          animation: menuFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        .mega-column { display: flex; flex-direction: column; gap: 6px; }
        .mega-column:first-child { border-right: 1px solid #334155; padding-right: 20px; }
        .mega-column:last-child { padding-left: 20px; }
        .mega-title { font-size: 14px; font-weight: 800; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px; }
        
        .mega-link { display: flex; align-items: center; gap: 10px; padding: 10px 12px; color: #cbd5e1; text-decoration: none; font-size: 13px; font-weight: 500; border-radius: 6px; transition: all 0.2s; }
        .mega-link:hover { background-color: rgba(56, 189, 248, 0.1); color: #38bdf8; padding-left: 16px; }
        
        .sign-in-banner { 
          background: linear-gradient(135deg, #38bdf8, #0284c7); 
          color: #fff; 
          text-align: center; 
          padding: 12px; 
          border-radius: 6px; 
          font-weight: 700; 
          text-decoration: none; 
          font-size: 14px; 
          margin-bottom: 14px; 
          display: block; 
          box-shadow: 0 4px 12px rgba(56, 189, 248, 0.2);
          transition: opacity 0.2s;
        }
        .sign-in-banner:hover { opacity: 0.95; }

        .lang-select { padding: 6px 10px; background-color: #1e293b; color: #38bdf8; border: 1px solid #334155; border-radius: 6px; font-size: 13px; font-weight: bold; cursor: pointer; outline: none; }
        
        /* High-Visibility Tech Cart */
        .cart-node { position: relative; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.2); padding: 8px 16px; border-radius: 8px; transition: all 0.2s; }
        .cart-node:hover { background: rgba(56, 189, 248, 0.15); border-color: #38bdf8; }
        .cart-badge { position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
      `}</style>

      <div className="nav-container">
        <Link to="/" className="brand-logo">Gen Z Store</Link>
        
        <form onSubmit={handleSearchSubmit} className="search-box">
          <input 
            type="text" 
            className="search-input"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>

        <div className="nav-actions">
          <select value={i18n.language} onChange={(e) => handleLanguageChange(e.target.value)} className="lang-select">
            <option value="en">🇬🇧 EN</option>
            <option value="np">🇳🇵 NP</option>
          </select>

          {/* ACCOUNTS CONTROL SUITE */}
          <div ref={loginRef} style={{ position: "relative" }}>
            <div onClick={() => setShowLoginDropdown(!showLoginDropdown)} className="nav-item-link">
              <span className="nav-subtext">Session</span>
              <span className="nav-maintext">Account Hub <span style={{ fontSize: "9px" }}>▼</span></span>
            </div>
            
            {showLoginDropdown && (
              <div className="mega-drop-menu">
                <div className="mega-column">
                  <h3 className="mega-title">Personal Lists</h3>
                  <Link to="/services/wishlist" className="mega-link" onClick={() => setShowLoginDropdown(false)}><span>❤️</span> Wishlist Items</Link>
                  <Link to="/products" className="mega-link" onClick={() => setShowLoginDropdown(false)}><span>🛍️</span> Discover Catalog</Link>
                </div>
                
                <div className="mega-column">
                  <h3 className="mega-title">Settings Matrix</h3>
                  {!isLoggedIn ? (
                    <Link to="/login" className="sign-in-banner" onClick={() => setShowLoginDropdown(false)}>Secure Login</Link>
                  ) : (
                    <div className="mega-link" onClick={() => { localStorage.clear(); navigate("/login"); setShowLoginDropdown(false); }} style={{ color: "#f87171", fontWeight: "bold", cursor: "pointer" }}>
                      <span>🔒</span> Terminate Session
                    </div>
                  )}
                  <Link to="/services/profile" className="mega-link" onClick={() => setShowLoginDropdown(false)}><span>👤</span> My Profile</Link>
                  <Link to="/orders" className="mega-link" onClick={() => setShowLoginDropdown(false)}><span>📦</span> Order Archives</Link>
                </div>
              </div>
            )}
          </div>

          <div ref={moreRef} style={{ position: "relative" }}>
            <div onClick={() => setShowMoreDropdown(!showMoreDropdown)} className="nav-item-link">
              <span className="nav-subtext">Quick Link</span>
              <span className="nav-maintext">Dashboard <span style={{ fontSize: "9px" }}>▼</span></span>
            </div>

            {showMoreDropdown && (
              <div className="mega-drop-menu" style={{ width: "240px", gridTemplateColumns: "1fr", right: 0 }}>
                <div className="mega-column">
                  <h3 className="mega-title">Control Hub</h3>
                  {userRole === "client" ? (
                    <Link to="/admin/add-product" className="mega-link" onClick={() => setShowMoreDropdown(false)}><span>💼</span> Seller Workspace</Link>
                  ) : (
                    <Link to="/register" className="mega-link" onClick={() => setShowMoreDropdown(false)}><span>💼</span> Apply as Merchant</Link>
                  )}
                  <div className="mega-link" onClick={() => setIsLightMode(!isLightMode)} style={{ cursor: "pointer" }}>
                    <span>{isLightMode ? "☀️" : "🌙"}</span> Alternate Interface
                  </div>
                  <Link to="/services/customer-care" className="mega-link" onClick={() => setShowMoreDropdown(false)}><span>🎧</span> Help & Support</Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="nav-item-link cart-node">
            <span className="nav-maintext">🛒 {t("cart")}</span>
            <span className="cart-badge">{getTotalItems()}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;