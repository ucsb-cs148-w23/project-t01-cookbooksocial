import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { renderIngredients } from "./functions/RecipePostFunctions";
import { Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import DeleteButton from "../deleteModal/deleteModal";

import { BsHeart, BsHeartFill,BsBookmark,BsFillBookmarkFill,BsBrush } from "react-icons/bs";

import axios from "axios";

import "./RecipePost.css";
import { IconContext } from "react-icons/lib";

/*
What does calling useState do? It declares a “state variable”. Our variable is called response but we could call it anything else, like banana. This is a way to “preserve” some values between the function calls. Normally, variables “disappear” when the function exits but state variables are preserved by React.
*/

function RecipePost({ recipe, isSavedPage,  deleteinSavedPage}) {
    const [showFullRecipe, toggleShowFullRecipe] = useState(false);
    const [editPostPath, setEditPostPath] = useState(`/edit-recipe/${recipe.id}`);

    const [isLiked, setIsLiked] = useState(false);
    const [numLikes, updateNumLikes] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    const [isLikedAnimation, setIsLikedAnimation] = useState(false);

    const { currentUser } = useAuth();

    const Recipe_URL = `/api/recipe/${recipe.id}`;

    /*
    useEffect(() => {
        updateNumLikes(recipe.likesByUid.length);
    }, [])
    */

    useEffect(() => {
        for (let i = 0; i < recipe.likesByUid.length; i++) {
            if (currentUser.uid === recipe.likesByUid[i]) {
                setIsLiked(true);
                setIsLikedAnimation(true);
                return;
            }
        }
        setIsLiked(false);
        

    }, []);
    useEffect(() => {
            //get isSaved 
            const URL_CHECK_SAVED_POST = `/api/recipe/checkSavedPost/${recipe.id}/${currentUser.uid}`
            fetch(URL_CHECK_SAVED_POST)
            .then((response) => response.json())
            .then((data) => {
                setIsSaved(data)
            })
            .catch((error) => console.log(error)); 
    }, []);


    async function toggleLiked() {
        setIsLikedAnimation(!isLikedAnimation);
        let newLikesByUid = [...recipe.likesByUid];
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

    //save function
    function SaveRecipe () {

        const URL_ADD_SAVED_POST = `/api/recipe/savedPost/${recipe.id}/${currentUser.uid}`;
        fetch(URL_ADD_SAVED_POST, {
            method: 'PUT',
            headers: {
            }
        });
        setIsSaved(true);
    }

    function unSaveRecipe () {
        if(isSavedPage){
            deleteinSavedPage()
        }
        else{
            const URL_ADD_SAVED_POST = `/api/recipe/savedPost/${recipe.id}/${currentUser.uid}`;
            fetch(URL_ADD_SAVED_POST, {
                method: 'DELETE',
                headers: {
                }
            });
            setIsSaved(false);
        }
    }

    //set num likes after like/unlike button pressed
    useEffect(() => {
        fetch(Recipe_URL)
            .then((response) => response.json())
            .then((data) => updateNumLikes(data.likesByUid.length));
    }, [isLiked]);

    function toggleShowFull() {
        toggleShowFullRecipe(!showFullRecipe);
    }

    function renderInstructions() {
        const arrComponents = [];
        for (let i = 0; i < recipe.instructions.length; i++) {
            arrComponents.push(<li>{recipe.instructions[i]}</li>);
        }
        return arrComponents;
    }

    function timeStamptoDate(createdAt) {
        const date = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000);
        const options = { year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    }

    function displayName(recipe) {
        // There is no 'user' in the recipe.

        if ("user" in recipe && "profile" in recipe.user) {
            if ("displayName" in recipe.user.profile) {
                return recipe.user.profile.displayName;
            }
        }
        if ("email" in recipe) {
            return recipe.email;
        } else {
            return "No author found!";
        }
    }

    function displayRecipeTitle(recipe) {
        return recipe.title;
    }

    return (
        <div>
            <div
                className="bg-white overflow-hidden pb-10 mb-10 border-b border-neutral-300 text-left"
              //  onClick={toggleShowFull}
            >
                
                <header className="header mb-2">
                    <h2 className="font-extrabold text-left text-4xl">
                        {displayRecipeTitle(recipe)}
                    </h2>
                </header>
                <p className="text-gray-700 mb-0">
                    By: <Link to={"/profile/" + recipe.uid}>{displayName(recipe)}</Link>
                    {/* We concatenate the user ID to the profile route, so it redirects us to the user page on click */}
                </p>
                <p className="text-gray-500">{timeStamptoDate(recipe.createdAt)}</p>

                <p>{recipe.description}</p>
                <div className="pb-2/3">
                    <Link to={`/recipe/${recipe.id}`}>
                        <img
                            className="h-full w-full object-cover aspect-[3/2]"
                            src={recipe.image}
                            alt="Recipe"
                        />
                    </Link>
                </div>

                <div className="display: flex">
                    <div className="likes-element">
                        {isLiked ? (
                            <IconContext.Provider value={{ color: "red" }}>
                                <div>
                                    <BsHeartFill className="likeIcon" onClick={toggleLiked} size="2em" />
                                    {" " + numLikes + " likes"}
                                </div>
                            </IconContext.Provider>
                        ) : (
                            <IconContext.Provider value={{ color: "black" }}>
                                <div>
                                    <BsHeart className="likeIcon" onClick={toggleLiked} size="2em" />
                                    {" " + numLikes + " likes"}
                                </div>
                            </IconContext.Provider>
                        )}
                    </div>
                    <div className="edit-element">                
                        {currentUser.uid === recipe.uid && (
                            <IconContext.Provider  value={{ color: "black" }}>
                                <a href={editPostPath}>
                                <BsBrush className="editIcon"  size="2em" />
                                  Edit
                                </a>
                            </IconContext.Provider>
                        )}
                    </div>
                    <div className="save-element">
                        {isSaved ? (
                                <IconContext.Provider value={{ color: "black" }}>
                                    <div>
                                        <BsFillBookmarkFill className="saveIcon" onClick={unSaveRecipe} size="2em" />
                                    </div>
                                </IconContext.Provider>
                            ) : (
                                <IconContext.Provider value={{ color: "black" }}>
                                    <div>
                                        <BsBookmark className="saveIcon" onClick={SaveRecipe} size="2em" />
                                    </div>
                                </IconContext.Provider>
                            )}
                    </div>
                </div>
                

                {showFullRecipe && (
                    <footer>
                        <div className="ingredients">
                            <h2 className="ingredients-header">Ingredients</h2>
                            <ul className="post-list">{renderIngredients(recipe.ingredients)}</ul>
                        </div>
                        <div className="instructions">
                            <h2 className="instructions-header">Instructions</h2>
                            <ol className="post-list">{renderInstructions()}</ol>
                        </div>
                    </footer>
                )}
            </div>
            {showFullRecipe && currentUser.uid === recipe.uid && (
                <div>
                    <a
                        type="button"
                        className="text-white bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-5 mb-5"
                        href={editPostPath}
                    >
                        Edit
                    </a>
                    <DeleteButton recipeId={recipe.id}></DeleteButton>
                    <hr></hr>
                </div>
            )}
        </div>
    );
}

export default RecipePost;
