const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['assignment', 'status_update'],
      required: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
