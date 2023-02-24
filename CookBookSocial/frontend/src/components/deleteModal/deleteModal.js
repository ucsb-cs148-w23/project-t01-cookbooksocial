import React, {useState} from "react";
import { useAuth } from '../../contexts/AuthContext';
import './deleteModal.css';


function DeleteModal({recipeId, show, setShow}){


    const { currentUser } = useAuth();
    const URL_DELETE_RECIPE = `/api/recipe/${recipeId}`

    function modalClosing(){
        setShow(false);
    }

    async function deletePost(){
        const response = await fetch(URL_DELETE_RECIPE, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        });
        console.log(response);
        setShow(false);
    }

    if (show){
        return (
            <div className="delete-modal overlay">
            <div className="delete-modal content">


            <div className="text-xl py-5">
                Are you sure you want to delete this recipe?
            </div>
            <div>

            </div>
            
            <span
                onClick={() => modalClosing()}
                type="button"
                className="btn btn-info m-2"
                 >
                Cancel
              </span>
            <span
                type="button"
                className="btn btn-danger m-2"
                 >
                Delete
              </span>


           
            </div>
        </div>
        );
    }
    return(
        null
    );
}

export default function DeleteButton({id}){
    const [showModal, setShowModal] = useState(false);

    return(
        <span>
            <span type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-2 mb-2"
              onClick={() => setShowModal(true)}
            >Delete</span>
            <DeleteModal
            recipeId={id}
            show={showModal}
            setShow={setShowModal}/>
        </span>
    )
}