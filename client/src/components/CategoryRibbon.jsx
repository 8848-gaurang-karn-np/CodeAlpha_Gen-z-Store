import { useState } from "react";

const CategoryRibbon = ({ onSelectCategory }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    { name: "All", icon: "📱" },
    { name: "Fashion", icon: "👕" },
    { name: "Mobiles", icon: "📱" },
    { name: "Beauty", icon: "💄" },
    { name: "Electronics", icon: "💻" },
    { name: "Home", icon: "🏠" },
    { name: "Appliances", icon: "📺" },
    { name: "Toys", icon: "🧸" },
    { name: "Food & Health", icon: "🍏" },
    { name: "Auto Accessories", icon: "🛠️" },
    { name: "2 Wheelers", icon: "🛵" }
  ];

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    if (onSelectCategory) {
      onSelectCategory(categoryName === "All" ? "" : categoryName);
    }
  };

  return (
    <div style={{ width: "100%", backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0", padding: "10px 0", display: "flex", justifyContent: "center", overflowX: "auto" }}>
      <div style={{ display: "flex", gap: "45px", padding: "0 20px" }}>
        {categories.map((cat) => (
          <div 
            key={cat.name} 
            onClick={() => handleCategoryClick(cat.name)}
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              cursor: "pointer",
              transition: "transform 0.2s",
              borderBottom: activeCategory === cat.name ? "3px solid #2874f0" : "3px solid transparent",
              paddingBottom: "4px"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <span style={{ fontSize: "24px", marginBottom: "6px" }}>{cat.icon}</span>
            <span style={{ fontSize: "13px", fontWeight: "bold", color: activeCategory === cat.name ? "#2874f0" : "#4a4a4a" }}>
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryRibbon;