# 🛒 Gen Z store — Full-Stack MERN E-Commerce Ecosystem

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

Welcome to **Gen Z store**, a high-performance, responsive full-stack e-commerce platform engineered using the MERN stack (MongoDB, Express.js, React, Node.js). Designed with a modern, customized dark-mode aesthetic, this application demonstrates scalable web architecture, secure user authentication workflows, global state-driven interactions, and robust database modeling.

Developed as a core engineering capstone project for the **CodeAlpha** software engineering internship path.

---

## 🏗️ System Architecture & Design Patterns

The application follows a decoupled client-server architecture, ensuring a clear separation of concerns between the user interface and the business logic:
* **Frontend:** A Single Page Application (SPA) built with React and Vite, utilizing the Context API to manage complex global states (like cart synchronization and user sessions) without prop-drilling.
* **Backend:** A scalable Node.js/Express RESTful API that handles data validation, secure routing, and business logic.
* **Database:** MongoDB Atlas serves as the NoSQL document database, utilizing Mongoose Object Data Modeling (ODM) to enforce strict schema validation and establish relational connections between Users, Orders, and Products.

---

## 🚀 Core Architectural Features

* **🔒 Role-Based Access Control (RBAC):** Integrated router pipeline supporting separate, secure user flows for both **Consumers** (shoppers) and **Clients** (merchants). Passwords are cryptographically hashed using `bcryptjs`, and sessions are maintained via JSON Web Tokens (JWT).
* **🛒 Synchronized Shopping Cart Mechanics:** Advanced client-side context tracking with inline increment, decrement, and item removal functions. The cart instantly re-calculates aggregate pricing variables and persists across page reloads.
* **💳 Secure Checkout Pipeline:** Full asynchronous transaction looping that seamlessly converts transient frontend cart arrays into permanent, timestamped MongoDB order documents.
* **📦 Live Order Registry:** A dedicated historical panel rendering unique transaction IDs, purchased item snapshots, precise dates, and delivery location matrices for complete user transparency.
* **❤️ Personal Favorites Vault (Wishlist):** A defensive, role-agnostic favoriting engine allowing all authenticated users to bookmark items and migrate products directly to their active cart.
* **👤 Dynamic Profile Workspace:** Customized user account mapping with embedded browser geolocation tracking and reverse geocoding API connections to map and update shipping coordinates automatically.

---

## 🛠️ Comprehensive Tech Stack

| Layer | Technologies & Libraries Employed |
| :--- | :--- |
| **Frontend UI Framework** | React (v18+), Vite Bundler, React Router DOM |
| **State Management** | React Context API, Custom Hooks |
| **Backend API Server** | Node.js, Express.js framework |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt.js, CORS |
| **Database & Modeling** | MongoDB Atlas, Mongoose ODM |
| **Styling & UI Assets** | CSS-in-JS, Inter Typography, Custom SVG Matrix |
| **DevOps & Tools** | Git, GitHub, Postman (API Testing), NodeMon |

---

## 📡 RESTful API Reference

The backend provides a structured API for client communication. Here is a snapshot of core endpoints:

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Registers a new Consumer or Client |
| `/api/auth/login` | `POST` | Public | Authenticates user and returns JWT |
| `/api/services/profile` | `GET` | Protected | Fetches verified user profile data |
| `/api/services/profile` | `PUT` | Protected | Updates user metrics and shipping addresses |
| `/api/services/wishlist` | `GET` | Protected | Retrieves populated user wishlist arrays |
| `/api/services/wishlist/toggle` | `POST` | Protected | Adds or removes an item from the wishlist |

---

## 📁 Repository Directory Matrix

```text
CodeAlpha_ProjectName/
├── client/                 # React Frontend Application (Vite framework)
│   ├── public/             # Static Assets & Favicons
│   ├── src/
│   │   ├── components/     # Reusable UI Architecture (Navbar, ProtectedRoute, Buttons)
│   │   ├── context/        # Global State Management Containers (AuthContext, CartContext)
│   │   ├── pages/          # Full-Screen Layouts (Home, Cart, Checkout, Profile)
│   │   └── App.jsx         # Client-Side Routing Tree Configuration
│   └── vite.config.js      # Bundler Configuration
└── server/                 # Node.js / Express Backend API
    ├── models/             # Mongoose Object Data Models (User, Order, Wishlist)
    ├── routes/             # RESTful Express Endpoints (authRoutes, services)
    ├── middleware/         # Security & Token Verification Guards
    ├── seed.js             # Automated Database Inventory Injector
    └── server.js           # Main Server Initialization Engine
