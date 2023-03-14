import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PostForm from "../../components/PostForm/PostForm";
import { useNavigate } from "react-router-dom";
import { firebaseUpload } from "../../utils/Api";
import { useAuth } from "../../contexts/AuthContext";

function NewPost() {
    const initialValues = {
        title: "",
        description: "",
        uid: "",
        ingredientList: [],
        stepList: [],
        stepText: "",
    };

    const handleSubmit = async (image, recipe) => {
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
            <PostForm initialValues={{ initialValues }} onSumbit={handleSubmit} />
        </>
    );
}

export default NewPost;
