import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/userApi";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const fetchProfile = async () => {
    const { data } = await getProfile();
    setUser(data);
    setBio(data.bio || "");
    setAvatar(data.avatar || "");
    setPreview(`http://localhost:5000${data.avatar || ""}`);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const uploadAvatar = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("avatar", file);

    const userInfo = JSON.parse(localStorage.getItem("user"));
    const config = {
      headers: { Authorization: `Bearer ${userInfo?.token}` },
      withCredentials: true,
    };

    const { data } = await axios.post(
      "http://localhost:5000/api/users/upload-avatar",
      formData,
      config
    );

    setAvatar(data.avatar);
    setPreview(`http://localhost:5000${data.avatar}`);
    alert("✅ Avatar uploaded successfully!");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateProfile({ bio, avatar });
    alert("Profile updated!");
    fetchProfile();
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>
        <img
          src={preview || "https://via.placeholder.com/100"}
          alt="Avatar"
          className="profile-avatar"
        />

        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <button onClick={uploadAvatar}>Upload New Avatar</button>

        <form onSubmit={handleUpdate} className="profile-form">
          <textarea
            placeholder="Write a short bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
