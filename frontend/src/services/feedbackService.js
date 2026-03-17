import api from "./api";

/* ───────── USER: Submit Feedback ───────── */
export const submitFeedback = async (feedbackData) => {
  try {
    const res = await api.post("/feedback", feedbackData);
    return res.data;
  } catch (err) {
    console.error("Submit Feedback Error:", err.response || err);
    throw err;
  }
};


/* ───────── ADMIN: Get All Feedback ───────── */
export const getAllFeedback = async () => {
  try {
    const res = await api.get("/feedback");
    return res.data;
  } catch (err) {
    console.error("Get All Feedback Error:", err.response || err);
    throw err;
  }
};