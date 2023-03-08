import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {BsBookmark,BsFillBookmarkFill} from "react-icons/bs"
import { IconContext } from "react-icons/lib";


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
        return(
            <IconContext.Provider value={{ color: "black" }}>
            <div>
                <BsBookmark className="icon" onClick={SaveRecipe} size="2em" />
            </div>
            </IconContext.Provider>
        )
    }
    else{
        return(
            <IconContext.Provider value={{ color: "orange" }}>
            <div>
                <BsFillBookmarkFill className="icon" onClick={unSaveRecipe} size="2em" />
            </div>
            </IconContext.Provider>
        )
    }

}