import React, { useState } from "react";
import { Link } from "react-router-dom";

import { renderIngredients } from "./functions/RecipePostFunctions";
import { useAuth } from "../../contexts/AuthContext";
import DeleteButton from "../deleteModal/deleteModal";
import commentIcon from "../../images/commentIcon.png";

import addCommentIcon from "../../images/sendComment.png"

import likeIcon from "../../images/likeIcon.png"

/*
What does calling useState do? It declares a “state variable”. Our variable is called response but we could call it anything else, like banana. This is a way to “preserve” some values between the function calls. Normally, variables “disappear” when the function exits but state variables are preserved by React.
*/

function RecipePost({ recipe }) {
    const [showFullRecipe, toggleShowFullRecipe] = useState(false);
    const [editPostPath, setEditPostPath] = useState(`/edit-recipe/${recipe.id}`);

    const { currentUser } = useAuth();

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
        console.log(recipe, recipe['user']);

        // There is no 'user' in the recipe.  
        if ('profile' in recipe.user) {
            if ('displayName' in recipe.user.profile) {
                return recipe.user.profile.displayName;
            }
        }
        if ('email' in recipe) {
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
                    <a className="pl-2" href={"profile/" + recipe.uid}>{displayName(recipe)}</a>
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
