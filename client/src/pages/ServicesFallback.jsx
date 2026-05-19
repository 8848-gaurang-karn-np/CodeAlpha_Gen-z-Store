import { useLocation, Link } from "react-router-dom";

const ServicesFallback = () => {
  const location = useLocation();
  
  // Format route path parameter into text titles dynamically
  const serviceName = location.pathname
    .split("/")
    .pop()
    .replace("-", " ")
    .replace(/(^\w|\s\w)/g, m => m.toUpperCase());

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "calc(100vh - 70px)", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", fontFamily: "Arial", padding: "20px", textAlign: "center" }}>
      <div style={{ backgroundColor: "#1e293b", padding: "50px 40px", borderRadius: "16px", border: "1px solid #334155", maxWidth: "500px", width: "100%" }}>
        <div style={{ fontSize: "48px", marginBottom: "15px" }}>⚙️</div>
        <h2 style={{ color: "#38bdf8", marginBottom: "10px", fontWeight: "800" }}>{serviceName} Workspace</h2>
        <p style={{ color: "#94a3b8", lineHeight: "1.6", marginBottom: "30px" }}>
          This core utility endpoint is successfully registered inside the Gen Z Store architecture branch matrix. Integration pipeline connection complete.
        </p>
        <Link to="/products" style={{ display: "block", padding: "12px 24px", backgroundColor: "#2874f0", color: "#fff", textDecoration: "none", borderRadius: "6px", fontWeight: "bold" }}>
          🛍️ Back to Storefront Catalog
        </Link>
      </div>
    </div>
  );
};

export default ServicesFallback;