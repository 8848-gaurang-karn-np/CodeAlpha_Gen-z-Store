import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "", email: "", phone: "", age: "",
    address: { street: "", city: "", state: "", zipCode: "" }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  // NEW: State to show a loading spinner on the button while fetching GPS
  const [locating, setLocating] = useState(false); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/services/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData({ ...userData, ...res.data.user }); 
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "zipCode"].includes(name)) {
      setUserData((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🌍 NEW: The Google Maps Auto-Locate Function
  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      setMessage("❌ Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    
    // 1. Get GPS Coordinates from browser
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Pulls from your .env file
          
          if (!apiKey) {
            setMessage("❌ API Key missing. Add VITE_GOOGLE_MAPS_API_KEY to your client/.env file.");
            setLocating(false);
            return;
          }

          // 2. Send GPS to Google Geocoding API
          const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
          
          if (res.data.status === "OK") {
            const addressComponents = res.data.results[0].address_components;
            
            // 3. Parse Google's complex address array into our simple format
            let streetNumber = "", route = "", city = "", state = "", zip = "";
            
            addressComponents.forEach(comp => {
              const types = comp.types;
              if (types.includes("street_number")) streetNumber = comp.long_name;
              if (types.includes("route")) route = comp.long_name;
              if (types.includes("locality") || types.includes("administrative_area_level_2")) city = comp.long_name;
              if (types.includes("administrative_area_level_1")) state = comp.short_name;
              if (types.includes("postal_code")) zip = comp.long_name;
            });

            // 4. Update the React state to instantly fill the form!
            setUserData(prev => ({
              ...prev,
              address: {
                street: `${streetNumber} ${route}`.trim(),
                city: city,
                state: state,
                zipCode: zip
              }
            }));
            
            setMessage("✅ Location found and applied!");
            // Automatically turn on editing mode if they aren't already in it
            setIsEditing(true); 
          } else {
            setMessage("❌ Could not resolve address from coordinates.");
          }
        } catch (error) {
          console.error("Geocoding Error:", error);
          setMessage("❌ Network error while fetching location.");
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error("GPS Error:", error);
        setMessage("❌ Please allow location permissions in your browser.");
        setLocating(false);
      }
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/services/profile", userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("❌ Error saving profile details.");
    }
  };

  if (loading) return (
    <div style={{ minHeight: "calc(100vh - 70px)", display: "flex", justifyContent: "center", alignItems: "center", background: "#0f172a" }}>
      <p style={{ color: "#38bdf8", fontSize: "18px", fontWeight: "bold", animation: "pulse 1.5s infinite" }}>Loading Profile...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 70px)", padding: "40px 20px", display: "flex", justifyContent: "center", alignItems: "flex-start", background: "#0f172a", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      <style>{`
        .profile-card { background: #1e293b; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 100%; max-width: 750px; border: 1px solid #334155; }
        .section-title { color: #f8fafc; font-size: 24px; margin-bottom: 25px; display: flex; alignItems: center; gap: 10px; border-bottom: 1px solid #334155; padding-bottom: 15px; }
        .input-group { margin-bottom: 20px; }
        .input-label { display: block; margin-bottom: 8px; color: #94a3b8; font-size: 14px; font-weight: 600; }
        .profile-input { width: 100%; padding: 12px 15px; border-radius: 6px; border: 1px solid #475569; background-color: #0f172a; color: #f8fafc; font-size: 15px; transition: all 0.3s; outline: none; }
        .profile-input:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2); }
        .profile-input:disabled { background-color: #1e293b; color: #64748b; border-color: #334155; cursor: not-allowed; }
        
        .btn-primary { padding: 12px 24px; background: linear-gradient(135deg, #2874f0, #38bdf8); color: white; border: none; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 10px rgba(40,116,240,0.3); }
        .btn-primary:hover { background: linear-gradient(135deg, #1a62d6, #0284c7); transform: translateY(-2px); box-shadow: 0 6px 15px rgba(56, 189, 248, 0.4); }
        .btn-secondary { padding: 12px 24px; background: transparent; color: #f8fafc; border: 1px solid #475569; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer; transition: all 0.3s; }
        .btn-secondary:hover { background: #334155; border-color: #f8fafc; }
        
        .btn-locate { padding: 6px 12px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid #38bdf8; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 5px; }
        .btn-locate:hover { background: rgba(56, 189, 248, 0.2); transform: translateY(-1px); }
        .btn-locate:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
      `}</style>

      <div className="profile-card">
        <h2 className="section-title"><span>👤</span> Personal Workspace</h2>
        
        {message && (
          <div style={{ marginBottom: "20px", padding: "12px", borderRadius: "6px", backgroundColor: message.includes("✅") ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", color: message.includes("✅") ? "#4ade80" : "#f87171", border: `1px solid ${message.includes("✅") ? "#22c55e" : "#ef4444"}`, textAlign: "center", fontWeight: "bold", transition: "all 0.3s" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* Identity Matrix */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" name="name" className="profile-input" value={userData.name} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="input-group">
              <label className="input-label">Registered Email</label>
              <input type="email" name="email" className="profile-input" value={userData.email} disabled />
            </div>
            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <input type="text" name="phone" className="profile-input" value={userData.phone || ""} onChange={handleChange} disabled={!isEditing} placeholder="+1 234 567 8900" />
            </div>
            <div className="input-group">
              <label className="input-label">Age</label>
              <input type="number" name="age" className="profile-input" value={userData.age || ""} onChange={handleChange} disabled={!isEditing} placeholder="e.g. 21" />
            </div>
          </div>

          {/* Location Matrix */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", marginBottom: "15px", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>
            <h3 style={{ color: "#94a3b8", fontSize: "16px", margin: 0 }}>Shipping Coordinates</h3>
            
            {/* 🌟 NEW: Auto Locate Button */}
            <button type="button" onClick={handleAutoLocate} disabled={locating} className="btn-locate">
              {locating ? "⏳ Locating..." : "📍 Auto-Locate"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="input-group" style={{ gridColumn: "span 2" }}>
              <label className="input-label">Street Address</label>
              <input type="text" name="street" className="profile-input" value={userData.address?.street || ""} onChange={handleChange} disabled={!isEditing} placeholder="123 Main St, Apt 4B" />
            </div>
            <div className="input-group">
              <label className="input-label">City</label>
              <input type="text" name="city" className="profile-input" value={userData.address?.city || ""} onChange={handleChange} disabled={!isEditing} placeholder="Metropolis" />
            </div>
            <div className="input-group">
              <label className="input-label">State / Province</label>
              <input type="text" name="state" className="profile-input" value={userData.address?.state || ""} onChange={handleChange} disabled={!isEditing} placeholder="NY" />
            </div>
            <div className="input-group" style={{ gridColumn: "span 2" }}>
              <label className="input-label">ZIP / Postal Code</label>
              <input type="text" name="zipCode" className="profile-input" value={userData.address?.zipCode || ""} onChange={handleChange} disabled={!isEditing} placeholder="10001" style={{ maxWidth: "50%" }} />
            </div>
          </div>

          {/* Action Hub */}
          <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #334155", display: "flex", gap: "15px", justifyContent: "flex-end" }}>
            {isEditing ? (
              <>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">💾 Save Parameters</button>
              </>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="btn-primary">✏️ Edit Profile</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;