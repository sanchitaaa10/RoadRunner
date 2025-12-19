<div align="center">

  <h1>🚛 RoadRunner Platform</h1>
  
  <p>
    <b>A Real-Time MERN Stack Logistics & Fleet Management System</b>
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-folder-structure">Structure</a> •
    <a href="#-getting-started">Getting Started</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" />
    <img src="https://img.shields.io/badge/Stack-MERN-blue?style=flat-square" />
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
  </p>

  <br />
</div>

---

## 📖 About The Project

**RoadRunner** is a modern logistics platform designed to bridge the gap between Dispatchers (Admins) and Drivers. It features a high-performance **Admin Dashboard** for managing fleets and a mobile-responsive **Driver App** for real-time tracking and job management.

The system uses **Socket.io** for instant communication and **Leaflet + OSRM** for smart routing without requiring expensive API keys.

---

## ✨ Features

### 🏢 **Admin Dashboard (Dispatcher)**
* **Live Map Tracking:** See all drivers moving in real-time on a map.
* **Smart Routing:** View actual road paths (not straight lines) for deliveries using OSRM.
* **Job Board:** Drag-and-drop Kanban board to manage shipments (Pending → On Route → Delivered).
* **Traffic Layer:** Toggle live traffic data using Google Maps tiles overlay.
* **Fleet Analytics:** Real-time stats on earnings, active drivers, and fuel usage.

### 🚚 **Driver App**
* **GPS Tracking:** Automatically broadcasts location to the server every few seconds.
* **Job Management:** Receive, accept, and complete jobs with a single tap.
* **Real-Time Chat:** Integrated chat widget to communicate with dispatchers instantly.
* **Smart Navigation:** Visualizes the pickup-to-dropoff route on an in-app map.
* **Status Control:** Go Online/Offline to start or stop shift tracking.

---

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Material UI (MUI), Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Real-Time** | Socket.io (WebSockets) |
| **Maps** | Leaflet, React-Leaflet, OSRM (Open Source Routing Machine) |

---

## 📂 Folder Structure

```bash
roadrunner-platform/
├── client/                 # Frontend (React + Vite)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI (ChatWidget, Sidebar, etc.)
│   │   ├── context/        # Global State (AuthContext)
│   │   ├── pages/          # Dashboard, MapView, DriverApp, JobsPage
│   │   ├── App.jsx         # Main Router
│   │   └── main.jsx        # Entry point
│   └── package.json
│
├── server/                 # Backend (Node + Express)
│   ├── models/             # Mongoose Schemas (User, Job)
│   ├── routes/             # API Endpoints (Auth, Jobs)
│   ├── server.js           # Entry point + Socket.io Logic
│   └── package.json
│
└── README.md               # Project Documentation
