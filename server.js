require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Direct routes for pages (optional but good practice)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/programs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "programs.html"));
});

app.get("/partner", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "partner.html"));
});

app.get("/media", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "media.html"));
});
// Ping route
app.get("/ping", (req, res) => {
  res.send("Server is alive ✅");
});
// Fallback route (for safety)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});