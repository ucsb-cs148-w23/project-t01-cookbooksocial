import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import './Confirmation.css';

function ConfirmationModal({ currID,friendID, friendName, isOpen, onRequestClose, onConfirm }) {
const [isSubmitting, setIsSubmitting] = useState(false);

const handleConfirm = async () => {
setIsSubmitting(true);
await onConfirm(currID);
const URL_UNFRIEND = `/api/user/unfriend/${'GdEsoCp4u4Pns98ShO7muM3FtVR2'}/${'HLewmuX74pgo34fLXYw8ZUDXUDP2'}`;
const response = fetch(URL_UNFRIEND, {
    method: 'PUT',
    headers: {
        'Content-type': 'application/json'
    }
}).then(function (data) {
   
    console.log(data);

});

console.log(`Confirming friend request from ${friendID} for user ${currID}`);

setIsSubmitting(false);
};

return (
<Modal
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