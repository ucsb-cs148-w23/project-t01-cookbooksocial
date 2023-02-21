import React, { useState } from "react";
import { Link } from "react-router-dom";

import { renderIngredients } from "./functions/RecipePostFunctions";

/*
What does calling useState do? It declares a “state variable”. Our variable is called response but we could call it anything else, like banana. This is a way to “preserve” some values between the function calls. Normally, variables “disappear” when the function exits but state variables are preserved by React.
*/

function RecipePost({ recipe }) {
    const [showFullRecipe, toggleShowFullRecipe] = useState(false);

    function toggleShowFull() {
        toggleShowFullRecipe(!showFullRecipe);
    }

    // function renderIngredients() {
    //     const arrComponents = []
    //     for (let i = 0; i < recipe.ingredients.length; i++) {
    //         arrComponents.push(<li>{recipe.ingredients[i]}</li>)
    //     }
    //     return arrComponents
    // }

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
        if (recipe.user && recipe.user.name) {
            return recipe.user.name;
        } else if (recipe.user && recipe.user.email) {
            return recipe.user.email;
        } else if (recipe.uid) {
            return `UID ${recipe.uid}`;
        } else {
            return "No author found! FIX THIS";
        }
    }

    function displayRecipeTitle(recipe) {
        return recipe.title
    }

    //To display the state variable in the html, use the {} curly brackets.  Simple!
    return (
        <div
            className="bg-white overflow-hidden pb-10 mb-10 border-b border-neutral-300 text-left"
            onClick={toggleShowFull}
        >
            <header className="header">
                {/* <h2 className="font-extrabold text-left text-3xl">{displayRecipeTitle(recipe)}</h2> */}
            </header>
            <p><Link to={`/profile/${recipe.uid}`}>By: {displayName(recipe)}</Link></p>
            <p>{timeStamptoDate(recipe.createdAt)}</p>
            <p>{recipe.description}</p>
            <div className="pb-2/3">
                <img
                    className="h-full w-full object-cover aspect-[3/2]"
                    src={recipe.image}
                    alt="NOT FOUND"
                />
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
    );
}

export default RecipePost;
