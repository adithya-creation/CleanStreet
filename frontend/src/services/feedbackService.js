import api from "./api";

/* ───────── USER: Submit Service Feedback ───────── */
export const submitFeedback = async (feedbackData) => {
  try {
    const res = await api.post("/feedback", feedbackData);
    return res.data;
  } catch (err) {
    console.error("Submit Feedback Error:", err.response || err);
    throw err;
  }
};

/* ───────── USER/VOLUNTEER: Submit Platform Feedback ───────── */
export const submitPlatformFeedback = async (feedbackData) => {
  try {
    const res = await api.post("/feedback/platform", feedbackData);
    return res.data;
  } catch (err) {
    console.error("Submit Platform Feedback Error:", err.response || err);
    throw err;
  }
};

/* ───────── ADMIN: Get All Service Feedback ───────── */
export const getAllFeedback = async () => {
  try {
    const res = await api.get("/feedback");
    return res.data;
  } catch (err) {
    console.error("Get All Feedback Error:", err.response || err);
    throw err;
  }
};

/* ───────── VOLUNTEER: Get My Ratings ───────── */
export const getMyVolunteerRatings = async () => {
  try {
    const res = await api.get("/feedback/volunteer/my-ratings");
    return res.data;
  } catch (err) {
    console.error("Get Volunteer Ratings Error:", err.response || err);
    throw err;
  }
};

/* ───────── ADMIN: Get Platform Feedback ───────── */
export const getAdminPlatformFeedback = async () => {
  try {
    const res = await api.get("/admin/feedback/platform");
    return res.data;
  } catch (err) {
    console.error("Get Admin Platform Feedback Error:", err.response || err);
    throw err;
  }
};

/* ───────── ADMIN: Get Volunteer Ratings ───────── */
export const getAdminVolunteerRatings = async () => {
  try {
    const res = await api.get("/admin/feedback/volunteer-ratings");
    return res.data;
  } catch (err) {
    console.error("Get Admin Volunteer Ratings Error:", err.response || err);
    throw err;
  }
};

/* ───────── ADMIN: Rate a Volunteer ───────── */
export const adminRateVolunteer = async (data) => {
  try {
    const res = await api.post("/admin/feedback/rate-volunteer", data);
    return res.data;
  } catch (err) {
    console.error("Admin Rate Volunteer Error:", err.response || err);
    throw err;
  }
};