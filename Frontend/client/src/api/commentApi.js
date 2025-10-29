import axios from "axios";

const API_URL = "http://localhost:5000/api/comments";

export const getComments = async (photoId) => {
  const { data } = await axios.get(`${API_URL}/${photoId}`);
  return data;
};

export const addComment = async (photoId, text, token) => {
  const { data } = await axios.post(
    `${API_URL}/${photoId}`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
