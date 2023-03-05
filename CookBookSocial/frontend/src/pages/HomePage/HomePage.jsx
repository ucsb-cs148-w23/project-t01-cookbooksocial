import { useState } from 'react';
import FriendsListModal from './FriendsListModal';
import modal from './Confirmation'
function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  return (
    <div>
      <h1>Welcome to My App</h1>
      <button onClick={handleOpenModal}>View Friends List</button>
      <FriendsListModal isOpen={isModalOpen} onRequestClose={handleCloseModal} />
    </div>
  );
}

export default HomePage;
