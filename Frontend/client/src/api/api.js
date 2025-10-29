// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // must match your backend port
  withCredentials: true, // optional
});

export default API; // ✅ this line is required
