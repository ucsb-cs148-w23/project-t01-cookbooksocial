import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import './RecipePost.css'
import PutModal from "../putModal/putModal.js";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import { renderIngredients } from './functions/RecipePostFunctions';

/*
What does calling useState do? It declares a “state variable”. Our variable is called response but we could call it anything else, like banana. This is a way to “preserve” some values between the function calls. Normally, variables “disappear” when the function exits but state variables are preserved by React.
*/

function RecipePost(props) {

    const [showFullRecipe, toggleShowFullRecipe] = useState(false)
    const { currentUser } = useAuth();
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

    let navigate = useNavigate();
    const editRedirect = (id) => {
        let path = `/edit-recipe/${id}`
        navigate(path)
    }
    //To display the state variable in the html, use the {} curly brackets.  Simple!
    return (
    <div className="post" onClick={toggleShowFull}> 

        <header className='header'>

            <div className='postTop'>
            <h2>{props.email}</h2>
                {currentUser.uid === props.uid && (
                        <Button variant='warning' className='recipePostEditBtn' onClick={ () => {editRedirect(props.id)}}>Edit</Button>
                )}
            </div>
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