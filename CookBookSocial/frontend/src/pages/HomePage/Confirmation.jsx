import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "./Confirmation.css";

Modal.setAppElement("#root");

function ConfirmationModal({ currID, friendID, isOpen, onRequestClose, onConfirm }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchFriend = async () => {
      const friendDoc = await firebase.firestore().collection("users").doc(friendID).get();
      const friendData = friendDoc.data();
      if (friendData && friendData.profile) {
        setDisplayName(friendData.profile.displayName);
      }
    };
    fetchFriend();
  }, [friendID]);

  const handleConfirm = async () => {
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
      <h2>Are you sure you want to unfriend {displayName}?</h2>
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
