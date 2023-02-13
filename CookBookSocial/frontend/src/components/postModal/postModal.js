import "./postModalStyles.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { storage, db } from "../../config/firebase";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";


import { useAuth } from "../../contexts/AuthContext";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
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
          className="ingInput"
          value={ingreText}
          onChange={onChangeIngreText}
        />
        <button className="addIngButton" onClick={onClickAdd}>
          add
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
      <h2 className="modalTitle">steps: </h2>
      {props.stepList.map((step, index) => (
        <div className="stepList" key={index}>
          <div className="stepListIndex">step {index + 1}:</div>
          <textarea
            className="modalStepDesc"
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
          className="modalStepDesc"
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

export function Modal({ show, setShow }) {
  const [isError, setIsError] = useState(false);
  const [errorOutput, setErrorOutput] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [email, setMail] = useState("");
  const [ingreList, setIngreList] = useState([]);
  const [stepList, setStepList] = useState([]);
  const [image, setImage] = useState([]);
  const [prevImg, setPrevImg] = useState("");
  const [stepText, setStepText] = useState("");

  const { currentUser } = useAuth();

  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);

  const [fullRecipeInfo, updateFullRecipeInfo] = useState({
    title: "",
    description: "",
    email: currentUser.email,
    ingredients: [],
    instructions: [],
  });

  useEffect(() => {
    updateFullRecipeInfo({
      ...fullRecipeInfo,
      title: title,
      description: desc,
      email: currentUser.email,
      ingredients: ingreList,
      instructions: stepList,
    });
  }, [title, desc, email, ingreList, stepList]);

  function validateTitle() {
    if (fullRecipeInfo.title.trim() == "") {
      setIsError(true);
      setErrorOutput(errorOutput + "Invalid Title! ");
      return false;
    }
    return true;
  }

  function validateDescription() {
    if (fullRecipeInfo.description.trim() == "") {
      setIsError(true);
      setErrorOutput(errorOutput + "Invalid Description! ");
      return false;
    }
    return true;
  }

  function validateEmail() {
    if (fullRecipeInfo.email.trim() == "") {
      setIsError(true);
      setErrorOutput(errorOutput + "Invalid Email! ");
      return false;
    }
    return true;
  }

  function validateIngredients() {
    if (fullRecipeInfo.ingredients.length == 0) {
      setIsError(true);
      setErrorOutput(errorOutput + "Invalid Ingredients! ");
      return false;
    }
    return true;
  }

  function validateFile() {
    if (image.length == "0") {
      setIsError(true);
      setErrorOutput(errorOutput + "Invalid Image! ");
      return false;
    }
    return true;
  }

  async function getiD(stringURL) {
    const postInfo = fullRecipeInfo;
    postInfo["createdAt"] = serverTimestamp();
    postInfo["image"] = stringURL;

    const res = await addDoc(collection(db, "recipes"), postInfo);

    // console.log("INSIDE OF GET ID FUNTION");

    return res;
  }

  function handleImage(pic) {
    setImage(pic);
    setPrevImg(URL.createObjectURL(pic));
  }

  function modalClosing() {
    setShow(false);
    setImage([]);
    setTitle("");
    setDesc("");
    setIngreList([]);
    setStepList([]);
    setStepText("");
    setPrevImg("");
  }

  function postRrecipe() {
    // add step Text to step List if it is not empty
    if (stepText != "") {
      stepList.push(stepText);
    }

    if (
      !validateTitle() ||
      !validateDescription() ||
      !validateIngredients() ||
      !validateFile()
    ) {
      return false;
    }
    setIsError(false);

    // console.log("IMAGE NAME: ", image.name);

    // Here we are uploading the image first, that way we can make sure the uploaded image is correct
    console.log("RECIPE INFO: ", fullRecipeInfo);

    const storageRef = ref(storage, `images/${image.name}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        console.log("ERROR IN UPLOAD TASK");
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
          let response = getiD(downloadURL);

          // console.log("This is the response: ", response);
          response.then(() => {
            console.log("Upload Completed:\n");
          });
        });
      }
    );

    uploadTask.then(() => {
      setImage([]);
      setTitle("");
      setDesc("");
      setIngreList([]);
      setStepList([]);
      setStepText("");
      setPrevImg("");

      console.log("Closing modal");
      setShow(false);
      // window.location.reload(false);
    });
  }

  if (show) {
    return (
      <div id="overlay">
        <div id="content">
          {isError && <div id="postModal-error-log">{errorOutput}</div>}

          <div className="container container-column">
            <div className="putLeft">
              <button
                className="postModal-close"
                onClick={() => modalClosing()}
              >
                Close
              </button>
            </div>
            {/* top part */}
            <div className="flex_first-box">
              <div className="flex_first-item"> </div>
              <div className="flex_first-item">
                <div>
                  <p className="modalTitle">Image</p>
                  <form>
                    <input
                      id="postModal-img-input"
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
                  <a href="#" onClick={() => postRrecipe()}>
                    Post Now
                  </a>
                </div>
                <div className="titleContainers">
                  <p className="modalTitle">Title</p>
                  <input
                    className="inputTitle"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Recipe Name"
                  />
                </div>

                <p className="modalTitle">Description</p>
                <textarea
                  className="modalRecipeDesc"
                  value={desc}
                  onChange={(event) => setDesc(event.target.value)}
                  placeholder="Description"
                ></textarea>
              </div>
            </div>
            {/* second Part */}
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
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default function PostButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>New Post</button>
      <Modal show={showModal} setShow={setShowModal} />
    </div>
  );
}
