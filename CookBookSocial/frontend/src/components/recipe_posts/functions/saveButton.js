import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";


export default function SaveButton(recipeId){
    const { currentUser } = useAuth();
    const [ saved, setSaved] = useState(false);
    useEffect(() => { const URL_CHECK_SAVED_POST = `/api/recipe/checkSavedPost/${recipeId.RecipeId}/${currentUser.uid}`;

    fetch(URL_CHECK_SAVED_POST)
    .then((response) => response.json())
    .then((data) => {
        setSaved(data)
    })
    .catch((error) => console.log(error)); }, []);
    

    function SaveRecipe () {

        const URL_ADD_SAVED_POST = `/api/recipe/savedPost/${recipeId.RecipeId}/${currentUser.uid}`;
        const response = fetch(URL_ADD_SAVED_POST, {
            method: 'PUT',
            headers: {
            }
        });
        setSaved(true);
    }

    function unSaveRecipe () {

        const URL_ADD_SAVED_POST = `/api/recipe/savedPost/${recipeId.RecipeId}/${currentUser.uid}`;
        const response = fetch(URL_ADD_SAVED_POST, {
            method: 'DELETE',
            headers: {
            }
        });
        setSaved(false);
    }


    if(!saved){
        console.log(saved)
        return(
            <>
                <button  
                className="text-white bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-2 mb-2 mt-4"
                onClick={SaveRecipe}>
                    save
                </button>
            </>
        )
    }
    else{
        console.log(saved)
        return(
            <>
                <button  
                className="text-white bg-gradient-to-r from-blue-200 via-blue-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-100 dark:focus:ring-blue-400 font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-2 mb-2 mt-4"
                onClick={unSaveRecipe}>
                    unsave
                </button>
            </>
        )
    }

}