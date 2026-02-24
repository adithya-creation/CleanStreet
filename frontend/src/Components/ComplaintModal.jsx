import React from "react";

const ComplaintModal = ({ complaint, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2>{complaint.title}</h2>

        {complaint.photo && (
          <img
            src={`http://localhost:5000/uploads/${complaint.photo}`}
            alt="complaint"
            className="modal-image"
          />
        )}

        <p><strong>Description:</strong> {complaint.description}</p>
        <p><strong>Status:</strong> {complaint.status}</p>
        <p><strong>Address:</strong> {complaint.address}</p>
      </div>
    </div>
  );
};

export default ComplaintModal;