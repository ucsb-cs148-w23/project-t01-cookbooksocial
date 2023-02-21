import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './RecipePost.css'

import { renderIngredients } from './functions/RecipePostFunctions';

/*
What does calling useState do? It declares a “state variable”. Our variable is called response but we could call it anything else, like banana. This is a way to “preserve” some values between the function calls. Normally, variables “disappear” when the function exits but state variables are preserved by React.
*/

function RecipePost(props) {

    const [showFullRecipe, toggleShowFullRecipe] = useState(false)

    function toggleShowFull() {
        toggleShowFullRecipe(!showFullRecipe)
    }

    // function renderIngredients() {
    //     const arrComponents = []
    //     for (let i = 0; i < props.ingredients.length; i++) {
    //         arrComponents.push(<li>{props.ingredients[i]}</li>)
    //     }
    //     return arrComponents
    // }

    function renderInstructions() {
        const arrComponents = []
        for (let i = 0; i < props.instructions.length; i++) {
            arrComponents.push(<li>{props.instructions[i]}</li>)
        }
        return arrComponents
    }

    //To display the state variable in the html, use the {} curly brackets.  Simple!
    return (
    <div className="post" onClick={toggleShowFull}> 
        <header className='header'>
            <h2>{props.email}</h2>
            <h2>{props.title}</h2>
        </header>
        <div>
            <img className='imagePost' src={props.image} alt="NOT FOUND" />
            <p className='post-description'>{props.description}</p>
        </div>
        {showFullRecipe && 
            <footer>
                <div className="ingredients">
                    <h2 className='ingredients-header'>Ingredients</h2>
                    <ul className='post-list'>
                        {renderIngredients(props.ingredients)}
                    </ul>
                </div>
                <div className="instructions">
                    <h2 className='instructions-header'>Instructions</h2>
                    <ol className='post-list'> 
                        {renderInstructions()}
                    </ol>
                </div>
            </footer>
        }
    </div>
    );
}

export default RecipePost;