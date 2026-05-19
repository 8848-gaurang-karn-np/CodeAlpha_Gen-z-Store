import { Link } from "react-router-dom";
import BannerSlider from "../components/BannerSlider";

const Home = () => {
  // Configured cards to map category navigation paths seamlessly
  const gridDeals = [
    { title: "Trending Fashion Styles", path: "/products?category=Fashion", image: "👕", desc: "Up to 30% off on apparel sets" },
    { title: "Premium Mobile Devices", path: "/products?category=Mobiles", image: "📱", desc: "Latest smartphone additions" },
    { title: "Computing & Audio Gears", path: "/products?category=Electronics", image: "💻", desc: "Tactile setups and audio hubs" },
    { title: "Home & Room Decors", path: "/products?category=Home", image: "🏠", desc: "Comfort upgrades for interiors" }
  ];

  return (
    <div className="home-viewport">
      <style>{`
        .home-viewport { background-color: #eaeded; min-height: calc(100vh - 60px); padding: 25px 4%; font-family: system-ui, sans-serif; }
        .deal-matrix-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; margin-top: 20px; }
        .deal-card { background: #ffffff; padding: 24px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s; }
        .deal-card:hover { transform: translateY(-4px); }
        .deal-title { font-size: 18px; font-weight: 700; color: #111; margin: 0 0 12px 0; }
        .deal-visual-node { height: 160px; background: #f8fafc; display: flex; align-items: center; justify-content: center; font-size: 64px; border-radius: 4px; margin-bottom: 12px; }
        .deal-desc { font-size: 13px; color: #444; margin: 0 0 15px 0; }
        .deal-action-link { font-size: 14px; color: #007185; text-decoration: none; font-weight: 600; }
        .deal-action-link:hover { color: #c45500; text-decoration: underline; }
      `}</style>

      {/* AUTO-SLIDING BANNER CAROUSEL FRAMEWORK */}
      <BannerSlider />

      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111", margin: "10px 0 20px 0" }}>Shop Deals by Category</h2>
        
        {/* STRUCTURAL RAIL FOR GRID CARDS */}
        <div className="deal-matrix-grid">
          {gridDeals.map((deal, idx) => (
            <div key={idx} className="deal-card">
              <div>
                <h3 className="deal-title">{deal.title}</h3>
                <div className="deal-visual-node">{deal.image}</div>
                <p className="deal-desc">{deal.desc}</p>
              </div>
              <Link to={deal.path} className="deal-action-link">See all offers</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;