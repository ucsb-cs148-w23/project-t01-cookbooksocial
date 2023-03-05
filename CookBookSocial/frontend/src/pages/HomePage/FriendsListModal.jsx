import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

function FriendsListModal({ isOpen, onRequestClose }) {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFriends() {
      const auth = getAuth();
      const userID = auth.currentUser.uid;

      const db = getFirestore();
      const userDoc = doc(db, 'users', userID);
      const userSnap = await getDoc(userDoc);
      const userData = userSnap.data();
      const userFriends = userData.friends;

      const friendIDs = Object.keys(userFriends);
      console.log(friendIDs)
      const friendDocs = friendIDs.map((friendID) => doc(db, 'users', friendID));
      const friendSnaps = await Promise.all(friendDocs.map(getDoc));
      const friendData = friendSnaps
        .map((friendSnap, index) => ({
          ...friendSnap.data()?.profile,
          id: friendIDs[index] // add friendID as 'id' property
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
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}
            >
              {friends.map(({ displayName, photoURL, id }, index) => (
                <Link to={`/profile/${id}`} key={displayName}>
                  <li
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: index < friends.length - 1 && '1px solid #f2f2f2',
                    }}
                  >
                    <img
                      src={photoURL}
                      alt={`${displayName}'s profile picture`}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        marginRight: '8px',
                      }}
                    />
                    <span>{displayName}</span>
                    <button style={{ marginLeft: 'auto' }} onClick={(e) => { e.preventDefault(); console.log(`Unfriend ${displayName}`) }}>Unfriend</button>
                  </li>
                </Link>
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
