import React, { useEffect, useState } from "react";
import "../../components/postModal/postModalStyles.css";
import {firebaseUpdateWithImage, firebaseUpdateWithOutImage} from "../../components/Api";
import {useNavigate, useParams} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const IngreLists = (props) => {

    const [ingreText, setIngreText] = useState("");
    const onChangeIngreText = (event) => {
        setIngreText(event.target.value);
    };

    // add ingre to list
    const onClickAdd = () => {
        if (ingreText === "") return;

        props.ingreList.push(ingreText);
        setIngreText("");
    };

    // delete ingre form list
    const onClickDelete = (index) => {
        const deletedIngreList = [...props.ingreList];
        deletedIngreList.splice(index, 1);
        props.setIngreList(deletedIngreList);
    };

    return (
        <>
            <h2 className="modalTitle">Ingredients: </h2>
            <table>
                {
                    <tbody id="ingre-body">
                        {props.ingreList.map((ingre, index) => (
                            <tr key={index}>
                                <td className="modalSub">{ingre}</td>
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
            <div className="add-Ingre">
                <input
                    className="ingInput form-control"
                    value={ingreText}
                    placeholder='add ingredient'
                    onChange={onChangeIngreText}
                />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-1" onClick={onClickAdd}>
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
            <h2 className="modalTitle">Steps: </h2>
            {props.stepList.map((step, index) => (
                <div className="stepList" key={index}>
                    <div className="stepListIndex">step {index + 1}:</div>
                    <textarea
                        className="form-control"
                        placeholder="add step"
                        value={step}
                        onChange={(event) => onChangeOldStep(index, event.target.value)}
                    ></textarea>
                    <button
                        className="stepListbutton"
                        onClick={() => onClickDelete(index)}
                    >
                        -
                    </button>
                </div>
            ))}
            <div className="stepList">
                <div className="stepListIndex">step {props.stepList.length + 1}:</div>
                <textarea
                    className="form-control"
                    placeholder="add step"
                    value={props.stepText}
                    onChange={onChangeStepText}
                />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-1" onClick={onClickAdd}>
                    +
                </button>
            </div>
        </>
    );
};

export default function EditPost() {

    const [recipeData, setRecipeData] = useState();


    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [email, setMail] = useState("");
    const [uid, setUID] = useState("");
    const [ingreList, setIngreList] = useState([]);
    const [stepList, setStepList] = useState([]);
    const [stepText, setStepText] = useState("");
    const [image, setImage] = useState([]);
    const [prevImg, setPrevImg] = useState("");

    const { currentUser } = useAuth();

    const [updatedRecipeInfo, setUpdatedRecipeInfo] = useState({
        title: "",
        description: "",
        email: currentUser.email,
        uid: currentUser.uid,
        ingredients: [],
        instructions: [],
    });




    const {id} = useParams();
    console.log(id);

    const URL_GET_RECIPE_BY_ID = `/api/recipe/${id}`;

    useEffect(() => {
        fetch(URL_GET_RECIPE_BY_ID)
            .then((response) => response.json())
            .then((data) => {
                setRecipeData(data);
                // setUpdatedRecipeInfo({
                //     ...updatedRecipeInfo,
                //     title: data['title'],
                //     description: data['description'],
                //     ingredients: data['ingredients'],
                //     instructions: data['instructions'],
                // });
                setTitle(data['title']);
                setDesc(data['description']);
                setIngreList(data['ingredients']);
                setStepList(data['instructions']);

            });
    }, []);

    useEffect(() => {
        setUpdatedRecipeInfo({
            ...updatedRecipeInfo,
            title: title,
            description: desc,
            email: currentUser.email,
            uid: currentUser.uid,
            ingredients: ingreList,
            instructions: stepList,
        });
    }, [title, desc, email, uid, ingreList, stepList]);

    console.log(updatedRecipeInfo);

    function handleImage(pic) {
        setImage(pic);
        setPrevImg(URL.createObjectURL(pic));
    }

    function postRecipe(){

    }





    

        return ( 
            <div className="container container-column">
                <div className="putLeft">
                </div>
                <div className="flex_first-box">
                    <div className="flex_first-item"> </div>
                    <div className="flex_first-item">
                        <div>
                            <p className="modalTitle">Image</p>
                            <form>
                                <input
                                    id="postModal-img-input"
                                    className="form-contol-file"
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={(event) => handleImage(event.target.files[0])}
                                />
                            </form>

                            {prevImg && (
                                <div className="prevPicContainer">
                                    <img className="prevImage" src={prevImg} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex_first-item">
                        <div className="postConfirm">
                            <a href="#" onClick={() => postRecipe()}>
                                Post Now
                            </a>
                        </div>
                        <div className="titleContainers">
                            <p className="modalTitle">Title</p>
                            <input
                                className="form-control"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Recipe Name"
                            />
                        </div>

                        <p className="modalTitle">Description</p>
                        <textarea
                            className="form-control"
                            value={desc}
                            onChange={(event) => setDesc(event.target.value)}
                            placeholder="Description"
                        ></textarea>
                    </div>
                </div>
                <div className="flex_second-box">
                    <div className="flex_second-item">
                        <IngreLists ingreList={ingreList} setIngreList={setIngreList} />
                    </div>
                    <div className="flex_second-item">
                        <StepLists
                            stepList={stepList}
                            setStepList={setStepList}
                            stepText={stepText}
                            setStepText={setStepText}
                        />
                    </div>
                    </div>
            </div>
            

        );









   
}


