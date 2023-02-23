import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import styles from './RecipePage.module.css';
import Navbars from "../../components/navbars/Navbars";
import { useAuth } from '../../contexts/AuthContext';
import DeleteModal from '../../components/deleteModal/deleteModal';

function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [editPostPath, setEditPostPath] = useState(``);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    const db = getFirestore();
    const recipeRef = doc(collection(db, 'recipes'), id);
    getDoc(recipeRef)
      .then(doc => {
        if (doc.exists()) {
          const data = doc.data();
          setRecipe(data);
          setEditPostPath(`/edit-recipe/${id}`)
        } else {
          console.log('Recipe not found!');
        }
      })
      .catch(error => {
        console.log('Error getting recipe:', error);
      });
  }, [id]);

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    
    const banner = document.createElement('div');
    banner.innerText = 'Link copied to clipboard!';
    banner.className = styles.copyBanner;
    document.body.appendChild(banner);
    setTimeout(() => {
      banner.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(banner);
      }, 2000);
    }, 1000);
    

  };

  if (!recipe) {
    return <div>Loading recipe...</div>;
  }

  // if(showDeleteModal){
  //   return(<DeleteModal
  //   recipe={recipe}
  //     recipeDate={recipe.createdAt.toDate().toLocaleDateString()}
  //   />);
  // } else {
    return(
      <div>

        <Navbars />
        <div className={styles.recipePage}>
          <h1 className={styles.recipeTitle}>{recipe.title}</h1>
          <div className={styles.recipeImageWrapper}>
            <img className={styles.recipeImage} src={recipe.image} alt={recipe.title} />
          </div>
          <div className={styles.recipeDetails}>
            <p className={styles.recipeDescription}>{recipe.description}</p>
            <div className={styles.recipeMetadata}>
              <p className={styles.recipeMetadataItem}>Posted by {recipe.email}</p>
              <p className={styles.recipeMetadataItem}>
                Posted on {recipe.createdAt.toDate().toLocaleDateString()}
              </p>
              <button className={styles.shareButton} onClick={handleShareClick}>
                Share
              </button>
            </div>
            <div className={styles.recipeIngredients}>
              <h2 className={styles.recipeSubheading}>Ingredients</h2>
              <ul className={styles.recipeIngredientsList}>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className={styles.recipeIngredient}>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.recipeInstructions}>
              <h2 className={styles.recipeSubheading}>Instructions</h2>
              <ol className={styles.recipeInstructionsList}>
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className={styles.recipeInstruction}>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        {currentUser.uid === recipe.uid && (
          <div>
            <a type="button" class="text-white bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-2 mb-2 mt-4"
              href={editPostPath}
            >Edit</a>
            <span type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-2 mb-2"
              onClick={() => setShowDeleteModal(true)}
            >Delete</span>
          </div>
        )}
      </div>
    );
  // }

  
}

export default RecipePage;
