import React, { useEffect, useState } from "react";
import { getComments, addComment } from "../api/commentApi";

const CommentSection = ({ photoId, user }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const data = await getComments(photoId);
    setComments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await addComment(photoId, text, user.token);
    setText("");
    fetchComments();
  };

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>

      <div className="comment-list">
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="comment-item">
              <strong>{c.user?.name}</strong>
              <p>{c.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
