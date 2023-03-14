import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseUpload } from "../../utils/Api";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

//add Recipe modal button by adding <PostButton/>

//recipe ingredients
const IngreLists = (props) => {
    // Ingre List
    const [ingreText, setIngreText] = useState("");

    // manage input form
    const onChangeIngreText = (event) => {
        setIngreText(event.target.value);
    };

    // add ingre to list
    const onClickAdd = () => {
        if (ingreText === "") return;

        props.ingredientList.push(ingreText);
        setIngreText("");
    };

    // delete ingre form list
    const onClickDelete = (index) => {
        const deletedIngreList = [...props.ingredientList];
        deletedIngreList.splice(index, 1);
        props.setIngredientList(deletedIngreList);
    };

    return (
        <>
            <h2 className="font-bold text-xl mb-4 text-gray-900">Ingredients:</h2>
            <table>
                {
                    <tbody id="">
                        {props.ingredientList.map((ingre, index) => (
                            <tr key={index}>
                                <td className="text-m text-chef-orange">{ingre}</td>
                                <td>
                                    <button
                                        className="delIngButton"
                                        onClick={() => onClickDelete(index)}
                                    >
                                        -
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                }
            </table>
            <div className="flex">
                <input
                    className="mt-2 border border-gray-300 text-gray-900 text-m rounded-lg focus:ring-chef-orange focus:outline-none focus:border-chef-orange 
                    block w-full p-2.5 transition duration-200 ease-in-out"
                    value={ingreText}
                    onChange={onChangeIngreText}
                />
                <button className="align-center ml-4" onClick={onClickAdd}>
                    Add
                </button>
            </div>
        </>
    );
};

//recipe step
const StepLists = (props) => {
    // step List

    // manage input form
    const onChangeStepText = (event) => {
        props.setStepText(event.target.value);
    };

    // add step to list
    const onClickAdd = () => {
        if (props.stepText === "") return;
        props.stepList.push(props.stepText);
        // reset add step form to ""
        props.setStepText("");
    };
    //change step description
    const onChangeOldStep = (index, updateText) => {
        const ChangedStepList = [...props.stepList];
        ChangedStepList[index] = updateText;
        props.setStepList(ChangedStepList);
    };

    // delete step form list
    const onClickDelete = (index) => {
        const deletedStepList = [...props.stepList];
        deletedStepList.splice(index, 1);
        props.setStepList(deletedStepList);
    };

    return (
        <>
            <h2 className="font-bold text-xl mb-4 text-gray-900">Steps:</h2>
            {props.stepList.map((step, index) => (
                <div className="mb-2 flex" key={index}>
                    <div className="whitespace-nowrap">Step {index + 1}:</div>
                    <textarea
                        className="border border-gray-300 text-gray-900 text-m rounded-lg focus:ring-chef-orange focus:outline-none focus:border-chef-orange 
                        block w-full p-2.5 transition duration-200 ease-in-out mx-2 resize-none"
                        value={step}
                        onChange={(event) => onChangeOldStep(index, event.target.value)}
                    ></textarea>
                    <button className="stepListbutton" onClick={() => onClickDelete(index)}>
                        -
                    </button>
                </div>
            ))}
            <div className="mb-2 flex">
                <div className="whitespace-nowrap">Step {props.stepList.length + 1}:</div>
                <textarea
                    className="border border-gray-300 text-gray-900 text-m rounded-lg focus:ring-chef-orange focus:outline-none focus:border-chef-orange 
                    block w-full p-2.5 transition duration-200 ease-in-out mx-2 resize-none"
                    value={props.stepText}
                    onChange={onChangeStepText}
                />
                <button className="stepListbutton" onClick={onClickAdd}>
                    +
                </button>
            </div>
        </>
    );
};

function PostForm({ initialValues, onSumbit }) {
    const [isError, setIsError] = useState(false);
    const [errorOutput, setErrorOutput] = useState("");

    const [image, setImage] = useState([]);
    const [prevImg, setPrevImg] = useState("");

    const [formData, setFormData] = useState(initialValues);

    const { title, description, stepText, stepList, ingredientList } = formData;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { currentUser } = useAuth();

    useEffect(() => {
        setFormData({
            ...formData,
            uid: currentUser.uid,
        });
    }, [currentUser.uid, formData]);

    const [recipe, updateRecipe] = useState({
        title: "",
        description: "",
        uid: currentUser.uid,
        ingredients: [],
        instructions: [],
        likesByUid: [],
    });

    useEffect(() => {
        updateRecipe({
            ...recipe,
            title: title,
            description: description,
            uid: currentUser.uid,
            ingredients: ingredientList,
            instructions: stepList,
        });
    }, [title, description, currentUser.uid, ingredientList, stepList]);

    function validate(input) {
        const errorMessages = [];
        Object.keys(input).forEach((key) => {
            const value = input[key];
            const rules = validationRules[key];
            if (!rules) {
                return;
            }
            if (rules.required && !value) {
                errorMessages.push(`Invalid ${key}!`);
            }
            if (rules.isArray && (!value || !value.length)) {
                errorMessages.push(`Invalid ${key}!`);
            }
        });
        return errorMessages.join(" ");
    }

    const validationRules = {
        title: { required: true },
        description: { required: true },
        uid: { required: true },
        ingredients: { isArray: true },
        image: { required: true },
    };

    function handleImage(pic) {
        setImage(pic);
        setPrevImg(URL.createObjectURL(pic));
    }

    function postRecipe() {
        // add step text to step List if it is not empty
        if (stepText !== "") {
            stepList.push(stepText);
        }

        // Validate the input
        const validationError = validate({
            title: recipe.title,
            description: recipe.description,
            uid: recipe.uid,
            ingredients: recipe.ingredients,
            image: image,
        });

        if (validationError) {
            setIsError(true);
            setErrorOutput(validationError);
            return false;
        }
        setIsError(false);
        setIsSubmitting(true);
        // console.log("IMAGE NAME: ", image.name);
    }

    return (
        <>
            <div id="">
                {isError && <div id="postModal-error-log">{errorOutput}</div>}

                <div className="max-w-lg mx-auto mt-8 mb-32 text-left md:px-0 px-4">
                    <div className="flex justify-between items-end border-b-2 border-chef-orange pb-2 mb-6">
                        <h1 className="text-gray-900 text-2xl font-bold">Add Recipe</h1>
                        <div className="text-center">
                            {isSubmitting ? (
                                <div className="bg-red-400 hover:bg-red-500 font-semibold h-8  rounded-xl text-white">
                                    <FaSpinner className="loading-spinner h-8" />
                                </div>
                            ) : (
                                <button
                                    className="bg-red-400 hover:bg-red-500 p-2 font-semibold rounded-xl text-white"
                                    onClick={() => postRecipe()}
                                >
                                    Post recipe
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-bold text-xl mb-1 text-gray-900">Title</h3>
                        <input
                            className="border border-gray-300 text-gray-900 text-m rounded-lg focus:ring-chef-orange focus:outline-none focus:border-chef-orange 
                        block w-full p-2.5 transition duration-200 ease-in-out"
                            value={title}
                            onChange={(event) =>
                                setFormData({ ...formData, title: event.target.value })
                            }
                            placeholder="Recipe Name"
                        />
                    </div>
                    <div className="mb-4">
                        <h3 className="font-bold text-xl mb-2 text-gray-900">Image</h3>
                        {!prevImg ? (
                            <form>
                                <div class="flex items-center justify-center w-full">
                                    <label
                                        for="dropzone-file"
                                        class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100"
                                    >
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                aria-hidden="true"
                                                class="w-10 h-10 mb-3 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                ></path>
                                            </svg>
                                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span class="font-semibold">Click to upload</span>{" "}
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                                PNG or JPG
                                            </p>
                                        </div>
                                        <input
                                            id="dropzone-file"
                                            type="file"
                                            accept="image/png, image/gif, image/jpeg"
                                            onChange={(event) => handleImage(event.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <img
                                    src={prevImg}
                                    alt="preview"
                                    className="w-full h-80 object-cover rounded-lg"
                                />
                                <button
                                    className="mt-2 p-2 bg-red-500 hover:bg-red-700 text-sm font-semibold rounded-lg text-white"
                                    onClick={() => {
                                        setPrevImg("");
                                        setImage("");
                                    }}
                                >
                                    Delete image
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold text-xl mb-1 text-gray-900">Description</h3>
                        <textarea
                            className="border border-gray-300 h-32 text-gray-900 text-m rounded-lg focus:ring-chef-orange focus:outline-none focus:border-chef-orange 
                                       block w-full p-2.5 transition duration-200 ease-in-out resize-none"
                            value={description}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    description: event.target.value,
                                })
                            }
                            placeholder="Descripe your recipe here"
                        ></textarea>
                    </div>

                    {/* second Part */}

                    <div className="mb-8">
                        <IngreLists
                            ingredientList={ingredientList}
                            setIngredientList={(ingredientList) =>
                                setFormData({ ...formData, ingredientList })
                            }
                        />
                    </div>
                    <div className="">
                        <StepLists
                            stepList={stepList}
                            setStepList={(stepList) => setFormData({ ...formData, stepList })}
                            stepText={stepText}
                            setStepText={(stepText) => {
                                setFormData({ ...formData, stepText });
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default PostForm;
