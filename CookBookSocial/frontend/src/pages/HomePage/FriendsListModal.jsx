import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import ConfirmationModal from "./Confirmation";

function FriendsListModal({ isOpen, onRequestClose }) {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendName, setFriendName] = useState(null);
  const auth = getAuth();
  const userID = auth.currentUser.uid;

  const openModal = (friend) => {
    setSelectedFriend(friend);
    setModalIsOpen(true);
    setFriendName(friend.displayName);
  };
  

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleConfirm = (currID, friendID) => {
    // Handle confirm logic here
    console.log(`Confirming friend request from ${friendID} for user ${currID}`);
  };

  useEffect(() => {
    async function fetchFriends() {
      const db = getFirestore();
      const userDoc = doc(db, 'users', userID);
      const userSnap = await getDoc(userDoc);
      const userData = userSnap.data();
      const userFriends = userData.friends;

      const friendIDs = Object.keys(userFriends);
      const friendDocs = friendIDs.map((friendID) => doc(db, 'users', friendID));
      const friendSnaps = await Promise.all(friendDocs.map(getDoc));
      const friendData = friendSnaps
        .map((friendSnap, index) => ({
          ...friendSnap.data()?.profile,
          id: friendIDs[index]
        }))
        .filter(Boolean);
      setFriends(friendData);
      setIsLoading(false);
    }

    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Friends List"
      style={{
        content: {
          width: '300px',
          height: '400px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          padding: '16px',
        },
      }}
    >
      {isLoading ? (
        <p>Loading friends...</p>
      ) : (
        <>
          {friends.length > 0 ? (
            <ul>
              {friends.map(({ displayName, photoURL, id }) => (
                <li key={id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom:  '1px solid #f2f2f2',
                }}
                
                >

                  <Link to={`/profile/${id}`} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <img
                      src={photoURL}
                      alt={`${displayName}'s profile picture`}
                      style={{ width: '40px', height: '40px' }}
                    />
                    <span>{displayName}</span>
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button onClick={() => openModal({ id, displayName })}>Unfriend</button>
                    {selectedFriend && (
                      <ConfirmationModal
                        currID={userID}
                        friendID={selectedFriend.id}
                        friendName={selectedFriend.displayName}
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        onConfirm={handleConfirm}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No friends found.</p>
          )}
        </>
      )}
    </Modal>
  );
}

export default FriendsListModal;
