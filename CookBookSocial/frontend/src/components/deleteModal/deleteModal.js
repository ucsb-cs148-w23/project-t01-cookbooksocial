import React, {useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './deleteModal.css';


function DeleteModal({recipeId, show, setShow}){

    const [isLoading, setIsLoading] = useState(false);
    const [hasErrorDelete, setHasErrorDelete] = useState(false);

    const URL_DELETE_RECIPE = `/api/recipe/${recipeId}`

    function modalClosing(){
        setShow(false);
        setHasErrorDelete(false);
    }

    let navigate = useNavigate();
    const location = useLocation();

    async function deletePost(){
        setIsLoading(true);
        const response = await fetch(URL_DELETE_RECIPE, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(function(data){
            setIsLoading(false);
            console.log(data);
            if(data.status === 200){
                setShow(false);
                if(location.pathname === '/profile'){
                    window.location.reload();
                } else {
                    console.log("Redirecting....");
                    let path = "/profile";
                    navigate(path);
                }
            } else {
                console.log("Backend failed to delete post.");
                setHasErrorDelete(true);

            }
        
        

        });
        console.log(response);
    }

    if (show){
        return (
            <div className="delete-modal overlay">
            <div className="delete-modal content">


            {isLoading && !hasErrorDelete && (
                          <div className="delete-modal loading">
                        <div className="text-xl py-5 delete-modal confirmation-text">
                            Deleting...
                        </div>

                            <span className="friend-request-loader-container">
                                <span className="friend-request-loader"></span>
                            </span>

                </div>

            )}
            {!isLoading && !hasErrorDelete && (
                <div>
                            <div className="text-xl py-5 delete-modal confirmation-text">
                                Are you sure you want to delete this recipe?
                            </div>

                            <button
                                onClick={() => modalClosing()}
                                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deletePost()}
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-full"
                            >
                                Delete
                            </button>
                </div>

            )}
            {hasErrorDelete && !isLoading && (
                        <div className="delete-modal">
                        <div className="text-xl py-5 delete-modal confirmation-text">
                                Error - Failed to Delete Recipe
                            </div>
                            <div>

                            </div>

                            <button
                                onClick={() => modalClosing()}
                                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full"
                            >
                                Return
                            </button>
                </div>

            )}
           


           
            </div>
        </div>
        );
    }
    return(
        null
    );
}

export default function DeleteButton({recipeId}){
    const [showModal, setShowModal] = useState(false);

    return(
        <span>
            <span type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-2 mb-2 "
              onClick={() => setShowModal(true)}
            >Delete</span>
            <DeleteModal
            recipeId={recipeId}
            show={showModal}
            setShow={setShowModal}/>
        </span>
    )
}