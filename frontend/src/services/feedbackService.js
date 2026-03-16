import axios from "axios";

export const submitFeedback = async (feedbackData) => {
  const res = await axios.post("/api/feedback", feedbackData);
  return res.data;
};