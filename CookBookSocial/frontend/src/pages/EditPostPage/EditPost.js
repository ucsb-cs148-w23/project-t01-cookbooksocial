import React, { useEffect, useState } from "react";
import { firebaseUpdateWithImage, firebaseUpdateWithOutImage } from "../../utils/Api";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import PostForm from "../../components/PostForm/PostForm";

export default function EditPost() {
    const [initialValues, setInitialValues] = useState(null);
    const [oldImage, setOldImage] = useState(null);

    const { currentUser } = useAuth();

    const { id } = useParams();

    const URL_GET_RECIPE_BY_ID = `/api/recipe/${id}`;

    useEffect(() => {
        fetch(URL_GET_RECIPE_BY_ID)
            .then((response) => response.json())
            .then((data) => {
                if (currentUser && currentUser.uid !== data.uid) {
                    navigate("/home");
                }
                console.log(data);
                setInitialValues({
                    title: data.title,
                    description: data.description,
                    uid: data.uid,
                    ingredientList: data.ingredients,
                    stepList: data.instructions,
                    stepText: "",
                    image: data.image,
                });
                setOldImage(data.image);
            });
    }, []);

    let navigate = useNavigate();

    const postRecipe = async (image, recipe, imageChanged) => {
        if (imageChanged) {
            firebaseUpdateWithImage(id, image, recipe, oldImage).then(() => {
                let path = "/profile";
                navigate(path);
            });
        } else {
            firebaseUpdateWithOutImage(id, oldImage, recipe);
            let path = "/profile";
            navigate(path);
        }
    };

    return (
        <>
            <Navbar />
            {initialValues && (
                <PostForm
                    initialValues={initialValues}
                    onSumbit={postRecipe}
                    heading="Edit Recipe"
                />
            )}
        </>
    );
}
