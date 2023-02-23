import React from "react";
import styles from "../../pages/RecipePage/RecipePage.module.css"
import Navbars from "../../components/navbars/Navbars";
import { useAuth } from '../../contexts/AuthContext';


export default function DeleteModal({recipe, recipeDate}){


    const { currentUser } = useAuth();


    return(
        <div className="delete-modal overlay">
            <div className="delete-modal content">

           
            </div>
        </div>
    )
}