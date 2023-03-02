import React, { useState, useEffect } from "react";
import { firebaseUpload } from "../Api";
import { useNavigate, useLocation } from "react-router-dom";

import { ref, getDownloadURL, uploadBytesResumable, deleteObject, getStorage } from "firebase/storage";
import { storage, db } from "../../config/firebase";
import { doc, addDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import {v4 as uuidv4} from 'uuid';
import {useParams} from "react-router-dom";


import { useAuth } from "../../contexts/AuthContext";



export default function SaveButton({recipeId}){

    const saveRecipe = async () =>{
        const URL_ADD_SAVED_RECIPE = `/api/recipe/${recipeId}`
        console.log(recipeId.uid)



    }






    return(
        <>
            <button  
            className="text-white bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-2 mb-2 mt-4"
            onClick={saveRecipe()}>
                save
            </button>
        </>
    )
}