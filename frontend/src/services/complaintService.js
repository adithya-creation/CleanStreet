import api from './api';

// Get all complaints (optionally filter by status)
export const getComplaints = async () => {
    const res = await api.get('/complaints');
    return res.data;
};

// Get complaints submitted by the logged-in user
export const getMyComplaints = async () => {
    const res = await api.get('/complaints/mine');
    return res.data;
};

// Create a new complaint
export const createComplaint = async ({ title, description, address, locationCoords, photo, type, priority }) => {
    const res = await api.post('/complaints', { title, description, address, locationCoords, photo, type, priority });
    return res.data;
};

// Get a single complaint by ID
export const getComplaintById = async (id) => {
    const res = await api.get(`/complaints/${id}`);
    return res.data;
};

// Update complaint status (admin/volunteer use)
export const updateComplaintStatus = async (id, status) => {
    const res = await api.patch(`/complaints/${id}/status`, { status });
    return res.data;
};

// Delete complaint
export const deleteComplaint = async (id) => {
  const res = await api.delete(`/complaints/${id}`);
  return res.data;
};

// Edit complaint
export const updateComplaint = async (id, data) => {
  const res = await api.put(`/complaints/${id}`, data);
  return res.data;
};