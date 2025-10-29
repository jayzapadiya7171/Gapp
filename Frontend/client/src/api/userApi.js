import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// === Get Logged-In User Profile ===
export const getProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  return API.get("/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// === Update Profile ===
export const updateProfile = (data) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  return API.put("/users/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
