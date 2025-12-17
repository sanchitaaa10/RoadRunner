const io = require("socket.io-client");
const socket = io("http://localhost:5001");

const DRIVER_ID = "driver-1"; // Matches "Driver Rahul"

// STARTING POINT: Navi Mumbai
let lat = 19.0330; 
let lng = 73.0297; 

console.log("🇮🇳 India Logistics Simulation Started...");

socket.on("connect", () => {
  console.log(`✅ Connected to Server as ${socket.id}`);

  setInterval(() => {
    // Move slightly North-West (towards Mumbai City)
    lat += 0.0005; 
    lng -= 0.0005;

    const payload = {
      driverId: DRIVER_ID,
      lat: lat,
      lng: lng
    };

    console.log(`📍 Truck moving in Mumbai: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    socket.emit("driverLocation", payload); 
  }, 2000); 
});