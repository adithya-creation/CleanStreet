const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    title: String,
    description: String,

    type: String,
    priority: String,
    nearbyLandmark: String,

    address: String,

    location: {
      lat: Number,
      lng: Number,
    },

    image: String,

    status: {
      type: String,
      default: 'received',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);