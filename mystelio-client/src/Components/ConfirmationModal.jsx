// ConfirmationModal.js
import React from "react";

const ConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <div className={`modal ${isOpen ? "show slide-fwd-top" : ""}`}>
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-content">
        <p>Are you sure you want to delete this post?</p>
        <div className="modal-buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
