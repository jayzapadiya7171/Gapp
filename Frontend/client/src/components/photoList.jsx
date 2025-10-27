import React from "react";
import axios from "axios";
import "../App.css";

const PhotoList = ({ photos, fetchPhotos, user }) => {
  // ❤️ Like / Unlike logic
  const handleLike = async (id) => {
    if (!user) return alert("Please log in to like photos");
    try {
      await axios.put(
        `http://localhost:5000/api/photos/${id}/like`,
        {}, // no body needed
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchPhotos(); // Refresh list after like/unlike
    } catch (error) {
      console.error("Error toggling like:", error);
      alert(error.response?.data?.message || "Error toggling like");
    }
  };

  // 🗑 Delete logic
  const handleDelete = async (id) => {
    if (!user) return alert("Please log in to delete photos");
    if (window.confirm("Delete this photo?")) {
      try {
        await axios.delete(`http://localhost:5000/api/photos/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        fetchPhotos();
      } catch (error) {
        console.error("Error deleting photo:", error);
        alert(error.response?.data?.message || "Error deleting photo");
      }
    }
  };

  // 🧩 Render photos
  return (
    <div className="photo-grid">
      {photos.length === 0 && <p>No photos yet. Upload one!</p>}

      {photos.map((p) => {
        const isLiked = p.likes?.includes(user?._id);

        return (
          <div key={p._id} className="photo-card">
            <img
              src={`http://localhost:5000${p.image}`}
              alt={p.title}
              className="photo-image"
            />
            <h4>{p.title}</h4>
            {p.user && <p className="photo-owner">by {p.user.name}</p>}

            <div className="photo-actions">
              {user && (
                <button
                  className={`like-btn ${isLiked ? "liked" : ""}`}
                  onClick={() => handleLike(p._id)}
                >
                  {isLiked ? "💖" : "🤍"}
                </button>
              )}
              <span className="like-count">
                {p.likes?.length || 0} {p.likes?.length === 1 ? "like" : "likes"}
              </span>

              {user && user._id === p.user?._id && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p._id)}
                >
                  🗑 Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhotoList;
