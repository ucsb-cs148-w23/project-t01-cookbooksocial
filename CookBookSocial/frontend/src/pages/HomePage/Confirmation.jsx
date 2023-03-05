import React, { useState } from "react";
import Modal from "react-modal";
import './Confirmation.css'

function ConfirmationModal({ currID, friendID, isOpen, onRequestClose, onConfirm }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    console.log("delete")
    setIsSubmitting(true);
    await onConfirm(currID, friendID);
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="modal-overlay"
      className="modal-content"
    >
      <h2>Are you sure you want to confirm friend request from {friendID} for user {currID}?</h2>
      <div className="button-group">
        <button
          disabled={isSubmitting}
          onClick={handleConfirm}
          className="modal-button modal-confirm-button"
        >
          Yes
        </button>
        <button
          disabled={isSubmitting}
          onClick={onRequestClose}
          className="modal-button modal-cancel-button"
        >
          No
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
