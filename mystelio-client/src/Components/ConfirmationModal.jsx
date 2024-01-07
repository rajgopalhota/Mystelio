// ConfirmationModal.js
import React from "react";

const ConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <div className={`modal ${isOpen ? "show" : ""}`}>
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-content slide-fwd-top">
        <p>Please confirm again? 😥</p>
        <div className="modal-buttons">
          <button onClick={onCancel} className="modal-btn cancel-btn"><i class="fa-solid fa-ban"></i>&nbsp;Cancel</button>
          <button onClick={onConfirm} className="modal-btn confirm-btn"><i class="fa-solid fa-circle-check"></i>&nbsp;Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
