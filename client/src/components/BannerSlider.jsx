import { useState, useEffect } from "react";

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock advertising banners matching the dynamic look of modern storefronts
  const slides = [
    { id: 1, text: "Explore Gifts for Everyone", sub: "Curated collections for every occasion", bg: "linear-gradient(to right, #e0f2fe, #bae6fd)", color: "#0369a1" },
    { id: 2, text: "Gen Z Store Electronics Blowout", sub: "Up to 40% off on premium audio & accessories", bg: "linear-gradient(to right, #fef3c7, #fde68a)", color: "#b45309" },
    { id: 3, text: "Upgrade Your Workspace", sub: "Tactile mechanical entry kits now in stock", bg: "linear-gradient(to right, #dcfce7, #bbf7d0)", color: "#15803d" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4500); // Transitions automatically every 4.5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="slider-wrapper">
      <style>{`
        .slider-wrapper { width: 100%; overflow: hidden; position: relative; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .slider-track { display: flex; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform: translateX(-${currentIndex * 100}%); }
        .slide-node { min-width: 100%; height: 280px; display: flex; flex-direction: column; justify-content: center; padding: 0 8%; box-sizing: border-box; }
        .slide-heading { font-size: 38px; font-weight: 800; margin: 0 0 10px 0; }
        .slide-sub { font-size: 18px; margin: 0; opacity: 0.9; }
        .dot-container { position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
        .indicator-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(0,0,0,0.2); border: none; cursor: pointer; transition: all 0.3s; }
        .indicator-dot.active { background: #2874f0; width: 24px; border-radius: 6px; }
      `}</style>

      <div className="slider-track">
        {slides.map((slide) => (
          <div key={slide.id} className="slide-node" style={{ background: slide.bg, color: slide.color }}>
            <h2 className="slide-heading">{slide.text}</h2>
            <p className="slide-sub">{slide.sub}</p>
          </div>
        ))}
      </div>

      <div className="dot-container">
        {slides.map((_, index) => (
          <button 
            key={index} 
            className={`indicator-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;