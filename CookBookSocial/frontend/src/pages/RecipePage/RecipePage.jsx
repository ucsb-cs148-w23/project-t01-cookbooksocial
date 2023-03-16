import { useState, useEffect,useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import styles from './RecipePage.module.css';
import Navbars from "../../components/Navbar/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import DeleteButton from "../../components/deleteModal/deleteModal";
import Comments from "../../components/Comments/Comments/Comments";
import LikeListModal from '../../components/LikeList/LikeList';

import commentIcon from "../../images/commentIcon.png"

import { BsHeart, BsHeartFill, BsBookmark, BsFillBookmarkFill, BsBrush } from 'react-icons/bs';
import { IconContext } from "react-icons/lib";
import axios from 'axios';

function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [editPostPath, setEditPostPath] = useState(``);
  const [recipeId, setRecipId] = useState();
  const [commentsArr, setCommentsArr] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [numLikes, updateNumLikes] = useState(0);
  const [isLikedAnimation, setIsLikedAnimation] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesByUidArray, setLikesByUidArray] = useState([]);

  const [initialRender, setInitialRender] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { currentUser } = useAuth();
  

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }


  useEffect(() => {

    setRecipId(id);
    const db = getFirestore();
    const recipeRef = doc(collection(db, "recipes"), id);
    getDoc(recipeRef)
      .then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setRecipe(data);
          setEditPostPath(`/edit-recipe/${id}`);
          if (data["comments"]) {
            setCommentsArr(data["comments"]);
          }
        } else {
          console.log('Recipe not found!');
          window.location.href = '/Invalid';
        }
      })
      .catch(error => {
        console.log('Error getting recipe:', error);
        window.location.href = '/Invalid';
      });


  }, [id]);

  const Recipe_URL = `/api/recipe/${id}`;

  useEffect(() => {
    
    if (initialRender) {
      setInitialRender(false);
    } else {
      for (let i = 0; i < recipe.likesByUid.length; i++) {
        if (currentUser.uid === recipe.likesByUid[i]) {
          setIsLiked(true);
          setIsLikedAnimation(true);
        }
      }
      updateNumLikes(recipe.likesByUid.length);
    }
  }, [recipe])



  useEffect(() => {
    if (recipeId) {
      fetch(Recipe_URL)
        .then((response) => response.json())
        .then((data) => {
          updateNumLikes(data.likesByUid.length)
          setLikesByUidArray(data.likesByUid)
        });
    }
  }, [isLiked])

  useEffect(() => {
    //get isSaved 
    const URL_CHECK_SAVED_POST = `/api/recipe/checkSavedPost/${id}/${currentUser.uid}`
    fetch(URL_CHECK_SAVED_POST)
      .then((response) => response.json())
      .then((data) => {
        setIsSaved(data)
      })
      .catch((error) => console.log(error));

  }, []);



  async function toggleLiked() {
    setIsLikedAnimation(!isLikedAnimation);
    let newLikesByUid = [...(recipe.likesByUid)];
    if (isLiked) {
      //remove current user.id from recipe list of users who liked the post
      for (let i = 0; i < newLikesByUid.length; i++) {
        if (currentUser.uid === newLikesByUid[i]) {
          //UPDATE the array of uid's of the recipe post
          newLikesByUid.splice(i, 1);
        }
      }
    } else {
      //add current user.id to recipe list of users who liked the post
      //UPDATE the array of uid's of the recipe post
      if (!recipe.likesByUid.includes(currentUser.uid)) {
        newLikesByUid.push(currentUser.uid);
      }
    }
    const newBody = { likesByUid: newLikesByUid };
    const response = await axios.put(Recipe_URL, newBody);
    setIsLiked(!isLiked);

  }

   function displayNumberComments() {

    return commentsArr.length;
    
  }
  async function scroll()
  { //buffer  for comments to load
    await new Promise(resolve => setTimeout(resolve,200 ));
    try {
      if (window.location.hash === '#comments') {
        window.scrollTo({
          top: document.getElementsByName('comments')[0].offsetTop + window.innerHeight,
          behavior: 'smooth'
        });
      }
      return commentsArr.length;
    } catch (error) {
    }
    
  }

  //save function
  function SaveRecipe() {
    const URL_ADD_SAVED_POST = `/api/recipe/savedPost/${id}/${currentUser.uid}`;
    fetch(URL_ADD_SAVED_POST, {
      method: 'PUT',
      headers: {
      }
    });
    setIsSaved(true);
  }

  function unSaveRecipe() {

    const URL_ADD_SAVED_POST = `/api/recipe/savedPost/${id}/${currentUser.uid}`;
    fetch(URL_ADD_SAVED_POST, {
      method: 'DELETE',
      headers: {
      }
    });
    setIsSaved(false);
  }


  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);

    const banner = document.createElement('div');
    banner.innerText = 'Link copied to clipboard!';
    banner.className = styles.copyBanner;
    document.body.appendChild(banner);
    setTimeout(() => {
      banner.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(banner);
      }, 2000);
    }, 1000);
  };



  if (!recipe) {
    return <div>Loading recipe...</div>;
  }

  return (
    <>

      <LikeListModal RecipeId={recipeId} isOpen={isModalOpen} onRequestClose={handleCloseModal} />
      <Navbars />
      <div className={styles.recipePage}>
        <h1 className={styles.recipeTitle}>{recipe.title}</h1>
        <div className={styles.recipeImageWrapper}>
        <img
  className={styles.recipeImage}
  src={recipe.image}
  alt={recipe.title}
  onLoad={scroll}
/>

        </div>
        <div className={styles.iconList}>
          <div className={styles.likesElement}>
            {isLiked ? ( 
                      <IconContext.Provider value={{ color: 'red' }}>
                          <div>
                              <BsHeartFill className={styles.icon} onClick={toggleLiked} size="1.8em" />
                              {" "}<div className={styles.numLikes} onClick={handleOpenModal}>{numLikes + " likes"}</div> 
                          </div>
                      </IconContext.Provider>
                  ) : (
                      <IconContext.Provider value={{ color: 'black' }}>
                        <div>
                          <BsHeart className={styles.icon} onClick={toggleLiked} size="1.8em" />
                          {" "}<div className={styles.numLikes} onClick={handleOpenModal}>{numLikes + " likes"}</div> 
                        </div>
                      </IconContext.Provider>
                  )}
          </div>
          <a name="comments"></a>

          <div className={styles.commentElement}>  <img className={styles.commentIcon} src={commentIcon} />  {displayNumberComments()} Comments</div>

          <div className={styles.editElement}>
            {currentUser.uid === recipe.uid && (<IconContext.Provider value={{ color: "black" }}><a href={editPostPath}><BsBrush className="editIcon" size="2em" />Edit</a></IconContext.Provider>)}
          </div>


          <div className={styles.saveElement}>
            {isSaved ? (<IconContext.Provider value={{ color: "black" }}><div><BsFillBookmarkFill className="saveIcon" onClick={unSaveRecipe} size="2em" /> </div></IconContext.Provider>)
              : (<IconContext.Provider value={{ color: "black" }}><div><BsBookmark className="saveIcon" onClick={SaveRecipe} size="2em" /></div></IconContext.Provider>)}
          </div>

        </div>
        <div className={styles.recipeDetails}>
          <p className={styles.recipeDescription}>{recipe.description}</p>
          <div className={styles.recipeMetadata}>
            <p className={styles.recipeMetadataItem}>Posted by: <Link to={`/profile/` + recipe.uid}>{recipe.email}</Link></p>
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
        {currentUser.uid === recipe.uid && (
          <div>
            <DeleteButton
              recipeId={recipeId}
            ></DeleteButton>
          </div>
        )}
      </div>
      <Comments
        currentUserId={currentUser.uid}
        recipeId={recipeId}
        comments={commentsArr}
      />
      {currentUser.uid === recipe.uid && (
        <div>
          <a
            type="button"
            className="text-white bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-2 mb-2 mt-4"
            href={editPostPath}
          >
            Edit
          </a>
          <DeleteButton recipeId={recipeId}></DeleteButton>
        </div>
      )}
    </>
  );
}

export default RecipePage;
