// UploadService.jsx
import axios from "axios";

const API_BASE = "http://localhost:8000";

export const generateDocument = async (payload) => {
  try {
    const res = await axios.post(`${API_BASE}/generate-doc`, payload);
    return res.data;
  } catch (err) {
    console.error("Error generating document:", err);
    throw err;
  }
};

export const uploadPDF = async (payload) => {
  try {
    const res = await axios.post(`${API_BASE}/upload`, payload);
    return res.data;
  } catch (err) {
    console.error("Error uploading PDF:", err);
    throw err;
  }
};
