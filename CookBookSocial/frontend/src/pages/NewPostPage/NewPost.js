import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../../components/Navbar/Navbar";
import PostForm from "../../components/PostForm/PostForm";
import { useNavigate } from "react-router-dom";
import { firebaseUpload } from "../../utils/Api";

function NewPost() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (obj) => firebaseUpload(obj.image, obj.recipe),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
        },
    });

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
        mutation.mutate(
            { image: image, recipe: recipe },
            {
                onSuccess: () => {
                    navigate("/");
                },
                onError: (error) => {
                    console.error(error);
                    alert("Error uploading image");
                },
            }
        );
        // firebaseUpload(image, recipe)
        //     .then(() => {
        //         navigate("/");
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //         alert("Error uploading image");
        //     });
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
