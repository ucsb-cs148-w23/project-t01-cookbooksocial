import './postModalStyles.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


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
      <h2 className='modalTitle'>Ingredients: </h2>
      <table>
       {
        <tbody id="ingre-body">  
          {props.ingreList.map((ingre, index) => (
            <tr key = {index}>
              <td className='modalSub'>{ingre}</td>
              <td><button onClick={() => onClickDelete(index)}>-</button></td>
            </tr>
            ))}
          </tbody>
        }    
      </table>
      <div className="add-Ingre">
        <input value={ingreText} onChange={onChangeIngreText} />
        <button onClick={onClickAdd}>add</button>
      </div>
    </>
  );
}




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
  const onChangeOldStep = (index,updateText) => {
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
      <h2 className='modalTitle'>steps: </h2>
       {  
          props.stepList.map((step, index) => (
            <div className='stepList' key={index} >
              <div className='stepListIndex'>step {index+1}:</div>
              <textarea className='modalStepDesc' value={step} onChange={(event) => onChangeOldStep(index,event.target.value)}></textarea>
              <button className='stepListbutton' onClick={() => onClickDelete(index)}>-</button>              
            </div>
            ))
        }    
      <div className='stepList'>
        <div className='stepListIndex'>step {props.stepList.length+1}:</div>
        <textarea className='modalStepDesc' value={props.stepText} onChange={onChangeStepText} />
        <button className='stepListbutton' onClick={onClickAdd}>+</button>
      </div>
    </>

  );
}






export function Modal({show, setShow}) {
  const [isError, setIsError] = useState(false);
  const [errorOutput, setErrorOutput] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [email, setMail] = useState("");
  const [ingreList, setIngreList] = useState([]);
  const [stepList, setStepList] = useState([]);
  const [image, setImage] = useState([]);
  const [stepText, setStepText] = useState("");

  const [fullRecipeInfo, updateFullRecipeInfo] = useState({
    title: "",
    description: "",
    email: "",
    ingredients: [],
    instructions: [],
  });

  useEffect(() => {
    updateFullRecipeInfo({
      ...fullRecipeInfo,
      title: title,
      description: desc,
      email: email,
      ingredients: ingreList,
      instructions: stepList,
    });
  }, [title, desc, email, ingreList, stepList,])
  
  function validateTitle(){
    if(fullRecipeInfo.title.trim() == ""){
      setIsError(true);
      setErrorOutput(errorOutput + "Invalid Title! ")
      return false;
    }
    return true;
  }

  function validateDescription() {
    if (fullRecipeInfo.description.trim() == "") {
      setIsError(true);
      setErrorOutput(errorOutput + "Invalid Description! ")
      return false;
    }
    return true;
  }

  function validateEmail() {
    if (fullRecipeInfo.email.trim() == "") {
      setIsError(true);
      setErrorOutput(errorOutput + "Invalid Email! ")
      return false;
    }
    return true;
  }

  function validateIngredients() {
    if (fullRecipeInfo.ingredients.length == 0) {
      setIsError(true);
      setErrorOutput(errorOutput + "Invalid Ingredients! ")
      return false;
    }
    return true;
  }

  function validateFile() {
    if (image.length == '0') {
      setIsError(true);
      setErrorOutput(errorOutput + "Invalid Image! ")
      return false;
    }
    return true;
  }




  function postRrecipe(){
    // add step Text to step List if it is not empty
    if (stepText != ""){
    stepList.push( stepText);
    }

    if (!validateTitle() || !validateDescription() || !validateEmail() || !validateIngredients() || !validateFile()){
      return false;
    }
    setIsError(false);


    
    console.log(fullRecipeInfo)

    const formData = new FormData();
    formData.append('recipe', JSON.stringify(fullRecipeInfo));
    formData.append('file', image);
    console.log(image);

    axios.post('/api/recipe/', formData)
      .then(response => console.log(response));



    ///

    /// code to sending a data to firebase (need to code)

    ///

    setImage([]);
    setTitle("")
    setDesc("")
    setMail("")
    setIngreList([])
    setStepList([])
    setStepText("")
    setShow(false)
    window.location.reload(false);
  }



  if (show) {
    return (
      <div id="overlay">
        <div id="content"　>
        {isError && ( 
            <div id="postModal-error-log">
              {errorOutput}
            </div>
        )
        }
      
          <div className="container container-column">
            <div className = "putLeft"> <button className="postModal-close" onClick={() => setShow(false)}>Close</button></div>
            {/* top part */}
            <div className="flex_first-box">
              <div className="flex_first-item">  </div>
              <div className="flex_first-item">
                
                <div>
                  <p className='modalTitle'>Image</p>
                  <form>
                    <input id='postModal-img-input' type='file' accept="image/png, image/gif, image/jpeg" onChange={(event) => setImage(event.target.files[0])} />
                  </form>
                </div>


              </div>
              <div className="flex_first-item">
                <div className="postConfirm"> <a href ="#" onClick={()=>postRrecipe()} >Post Now</a> </div>
                <div>
                <p className='modalTitle'>Title</p>
                <input className='inputTitle' value={title} onChange={(event) => setTitle(event.target.value)} placeholder='Recipe Name' />
                <p className='modalTitle'>Description</p>
                  <textarea className="modalRecipeDesc" value={desc} onChange={(event) => setDesc(event.target.value)} placeholder='Description'></textarea>
                <p className='modalTitle'>E-mail</p>
                  <input className='inputEmail' value={email} onChange={(event) => setMail(event.target.value)} placeholder='Email'></input>
                </div>
              </div>
            </div>
            {/* second Part */}
            <div className="flex_second-box">
              <div className="flex_second-item">
                <IngreLists ingreList={ingreList} setIngreList={setIngreList}/>
              </div>
              <div className="flex_second-item">
                <StepLists stepList ={stepList} setStepList={setStepList} stepText = {stepText} setStepText = {setStepText} />
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  } else {
    return null;
  }
}


export default function PostButton() {
  const [showModal, setShowModal] = useState(false)
  
  return (
     <div>
       <button onClick={() => setShowModal(true)}>New Post</button>
       <Modal show={showModal} setShow={setShowModal} />
     </div>
   )
 }

