import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import './Confirmation.css';

function ConfirmationModal({ currID,friendID, friendName, isOpen, onRequestClose, onConfirm }) {
const [isSubmitting, setIsSubmitting] = useState(false);

const handleConfirm = () => {
    onConfirm(currID, friendID);
   // onRequestClose();
  };


return (
<Modal
    ariaHideApp={false}
   isOpen={isOpen}
   onRequestClose={onRequestClose}
   overlayClassName="modal-overlay"
   className="modal-content"
 >
<h2>Are you sure you want to unfriend {friendName}?</h2>
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