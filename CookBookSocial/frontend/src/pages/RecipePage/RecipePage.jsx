import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import styles from './RecipePage.module.css';

function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const db = getFirestore();
    const recipeRef = doc(collection(db, 'recipes'), id);

    getDoc(recipeRef)
      .then(doc => {
        if (doc.exists()) {
          const data = doc.data();
          setRecipe(data);
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
    banner.className = styles.fancyBanner;
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

  return (
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
  );
}

export default RecipePage;
