import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Register from "./components/Register";
import Login from "./components/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AddProduct from "./components/AddProduct";
import ClientOrders from "./pages/ClientOrders";
import ServicesFallback from "./pages/ServicesFallback"; 

// 🌟 NEW: Import your fully built user pages!
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";

import { CartProvider } from "./context/CartContext"; 
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Main Routing Segments */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* 🌟 NEW: Map the specific routes to your new pages */}
          <Route path="/services/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/services/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/orders" element={<Orders />} />

          {/* Fallback for unfinished services (like Gift Cards, Plus Zone) */}
          <Route path="/services/*" element={<ServicesFallback />} />

          {/* Secure Client Operator Panels */}
          <Route path="/admin/add-product" element={<ProtectedRoute allowedRole="client"><AddProduct /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute allowedRole="client"><ClientOrders /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;