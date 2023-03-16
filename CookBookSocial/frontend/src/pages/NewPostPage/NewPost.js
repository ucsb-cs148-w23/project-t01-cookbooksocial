import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PostForm from "../../components/PostForm/PostForm";
import { useNavigate } from "react-router-dom";
import { firebaseUpload } from "../../utils/Api";

function NewPost() {
    const initialValues = {
        title: "",
        description: "",
        uid: "",
        ingredientList: [],
        stepList: [],
        stepText: "",
        image: "",
    };

    const handleSubmit = async (image, recipe, imageChanged) => {
        firebaseUpload(image, recipe)
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                console.error(error);
                alert("Error uploading image");
            });
    };

    let navigate = useNavigate();

    return (
        <>
            <Navbar />
            <PostForm initialValues={initialValues} onSumbit={handleSubmit} heading="New Recipe" />
        </>
    );
}

export default NewPost;
