import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const PhotoList = ({ photos, fetchPhotos, user }) => {
  const [comments, setComments] = useState({}); // store comments by photoId
  const [newComment, setNewComment] = useState({}); // track input text

  // ❤️ Like / Unlike logic
  const handleLike = async (id) => {
    if (!user) return alert("Please log in to like photos");
    try {
      await axios.put(
        `http://localhost:5000/api/photos/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchPhotos();
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

  // 💬 Fetch comments for a photo
  const fetchComments = async (photoId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/comments/${photoId}`
      );
      setComments((prev) => ({ ...prev, [photoId]: data }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // ✍️ Post comment
  const handleCommentSubmit = async (photoId) => {
    if (!user) return alert("Please log in to comment");
    const text = newComment[photoId];
    if (!text?.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/comments/${photoId}`,
        { text },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNewComment({ ...newComment, [photoId]: "" });
      fetchComments(photoId);
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(error.response?.data?.message || "Error adding comment");
    }
  };

  return (
    <div className="photo-grid">
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

            {/* Like/Delete Actions */}
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
                {p.likes?.length || 0}{" "}
                {p.likes?.length === 1 ? "like" : "likes"}
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

            {/* 💬 Comment Section */}
            <div className="comment-section">
              <button
                className="view-comments-btn"
                onClick={() => fetchComments(p._id)}
              >
                View Comments 💬
              </button>

              {/* Comment List */}
              {comments[p._id]?.map((c) => (
                <div key={c._id} className="comment-item">
                  <strong>{c.user?.name}: </strong>
                  <span>{c.text}</span>
                </div>
              ))}

              {/* Add Comment */}
              {user && (
                <div className="add-comment">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment[p._id] || ""}
                    onChange={(e) =>
                      setNewComment({ ...newComment, [p._id]: e.target.value })
                    }
                  />
                  <button onClick={() => handleCommentSubmit(p._id)}>Post</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhotoList;
