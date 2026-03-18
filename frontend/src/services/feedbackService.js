import api from "./api"; 

// 1. ADD THIS: This is what Feedback.jsx is looking for!
export const submitFeedback = async (feedbackData) => {
    try {
        // feedbackData should be { type, rating, comment, complaintId }
        const response = await api.post("/feedback/submit", feedbackData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 2. Keep your existing Admin functions below
export const getAllFeedbacks = async () => {
    try {
        const response = await api.get("/feedback/all");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const replyToFeedback = async (feedbackId, adminReply) => {
    try {
        const response = await api.post(`/feedback/reply/${feedbackId}`, { adminReply });
        return response.data;
    } catch (error) {
        throw error;
    }
};