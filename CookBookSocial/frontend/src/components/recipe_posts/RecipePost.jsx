import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { renderIngredients } from "./functions/RecipePostFunctions";
import { useAuth } from "../../contexts/AuthContext";
import DeleteButton from "../deleteModal/deleteModal";
import commentIcon from "../../images/commentIcon.png";

import addCommentIcon from "../../images/sendComment.png"

import likeIcon from "../../images/likeIcon.png"

import { BsHeart, BsHeartFill, BsBookmark, BsFillBookmarkFill, BsBrush } from "react-icons/bs";

import axios from "axios";

import "./RecipePost.css";
import { IconContext } from "react-icons/lib";

/*
What does calling useState do? It declares a “state variable”. Our variable is called response but we could call it anything else, like banana. This is a way to “preserve” some values between the function calls. Normally, variables “disappear” when the function exits but state variables are preserved by React.
*/

function RecipePost({ recipe, isSavedPage, deleteinSavedPage }) {
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
    function SaveRecipe() {

        const URL_ADD_SAVED_POST = `/api/recipe/savedPost/${recipe.id}/${currentUser.uid}`;
        fetch(URL_ADD_SAVED_POST, {
            method: 'PUT',
            headers: {
            }
        });
        setIsSaved(true);
    }

    function unSaveRecipe() {
        if (isSavedPage) {
            deleteinSavedPage()
        }
        else {
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

    function displayNumberComments() {
        if ("comments" in recipe) {
            return recipe.comments.length;
        }
        else {
            return 0;
        }
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
                    <Link className="pl-2" to={"/profile/" + recipe.uid}>{displayName(recipe)}</Link>
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

                <div className="bottomContainer">
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
                    <div className="comment-element">  <img className="imgContainer" src={commentIcon} />  {displayNumberComments()} Comments</div>

                    <div className="edit-element">
                        {currentUser.uid === recipe.uid && (
                            <IconContext.Provider value={{ color: "black" }}>
                                <a href={editPostPath}>
                                    <BsBrush className="editIcon" size="2em" />
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


            </div>



        </div >



    );
}

export default RecipePost;
