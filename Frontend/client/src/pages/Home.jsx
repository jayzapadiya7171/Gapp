import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadForm from "../components/UploadForm";
import PhotoList from "../components/photoList";

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);

  // ✅ Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/photos");
      setPhotos(data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="upload-heading">
    

      {/* ✅ Only show upload form if logged in */}
      {user ? (
        <UploadForm user={user} fetchPhotos={fetchPhotos} />
      ) : (
        <h4>Please log-in to upload photos.</h4>
      )}

      <PhotoList photos={photos} fetchPhotos={fetchPhotos} user={user} />
    </div>
  );
};

export default Home;
