import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { renderIngredients } from "./functions/RecipePostFunctions";
import { useAuth } from "../../contexts/AuthContext";
import DeleteButton from "../deleteModal/deleteModal";
import commentIcon from "../../images/commentIcon.png";

import addCommentIcon from "../../images/sendComment.png"

import likeIcon from "../../images/likeIcon.png"

import { BsHeart, BsHeartFill } from "react-icons/bs";
import axios from "axios";

import "./RecipePost.css";
import { IconContext } from "react-icons/lib";
/*
What does calling useState do? It declares a “state variable”. Our variable is called response but we could call it anything else, like banana. This is a way to “preserve” some values between the function calls. Normally, variables “disappear” when the function exits but state variables are preserved by React.
*/

function RecipePost({ recipe }) {
    const [showFullRecipe, toggleShowFullRecipe] = useState(false);
    const [editPostPath, setEditPostPath] = useState(`/edit-recipe/${recipe.id}`);

    const [isLiked, setIsLiked] = useState(false);
    const [numLikes, updateNumLikes] = useState(0);

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
        <div className="border-2 rounded-md border-orange-400 mb-10">
            <div
                className="bg-white overflow-hidden divide-y"
                onClick={toggleShowFull}
            >
                <h2 className="font-extrabold text-orange-400 text-4xl pt-2">{displayRecipeTitle(recipe)}</h2>
                <p className="text-orange-400 pl-5 pt-2 text-left">
                    Author:
                    <Link className="pl-2" to={"profile/" + recipe.uid}>{displayName(recipe)}</Link>
                    {/* We concatenate the user ID to the profile route, so it redirects us to the user page on click */}
                </p>
                <p className="pl-5 pt-2 text-orange-400 text-left">Date:
                    <p className="text-gray-500 pl-2 inline">{timeStamptoDate(recipe.createdAt)}</p>
                </p>
                <p className="text-orange-400 text-left pl-5 pt-2"> Description:
                    <p className="inline text-gray-500 pl-2">{recipe.description}</p>
                </p>
                <div className="pb-2/3">
                    <Link to={`/recipe/${recipe.id}`}>
                        <img
                            className="h-full w-full object-cover aspect-[3/2]"
                            src={recipe.image}
                            alt="Recipe"
                        />
                    </Link>
                </div>

                <div className="likes-element">
                    {isLiked ? (
                        <IconContext.Provider value={{ color: "red" }}>
                            <div>
                                <BsHeartFill className="icon" onClick={toggleLiked} size="2em" />
                                {" " + numLikes + " likes"}
                            </div>
                        </IconContext.Provider>
                    ) : (
                        <IconContext.Provider value={{ color: "black" }}>
                            <div>
                                <BsHeart className="icon" onClick={toggleLiked} size="2em" />
                                {" " + numLikes + " likes"}
                            </div>
                        </IconContext.Provider>
                    )}
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
            {
                showFullRecipe && currentUser.uid === recipe.uid && (
                    <div>
                        <a type="button" className="text-white bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-5 mb-5"
                            href={editPostPath}
                        >Edit</a>
                        <DeleteButton
                            recipeId={recipe.id}
                        ></DeleteButton>
                        <hr></hr>
                    </div>
                )
            }
            <div className="pt-3 pb-6 border-t-2 ">
                {currentUser && (
                    <>
                        <div align="left" className="pb-3 ml-5">
                            <div className="inline pr-5"><img className="w-5 h-5 inline" src={likeIcon} alt="Like Icon" /> <p className="inline">Like</p> </div>
                            <div className="inline"> <img className="w-5 h-5 inline" src={commentIcon} alt="Comment Icon" />  <p className="inline">Comment</p></div>
                        </div>

                        <div align="left" className="pl-5 pr-3 pt-3 border-t-2">
                            <img className="w-12 h-12 inline pr-3" src={currentUser.photoURL}></img>
                            <input className="inline w-10/12 placeholder:italic placeholder:text-slate-400 block bg-white border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Add a comment" type="text" name="comment" />
                            <img src={addCommentIcon} className="inline ml-3 w-8 h-8" />
                        </div>
                    </>
                )}
            </div>

        </div >
    );
}

export default RecipePost;
