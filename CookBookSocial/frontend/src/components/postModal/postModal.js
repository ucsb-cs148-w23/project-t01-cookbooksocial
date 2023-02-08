import './postModalStyles.css';
import React, { useState } from 'react';



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

function enterFile(event){
  const data = new FormData() ;
  data.append('file', event.target.files[0]);

}

async function uploadFile() {
  await axios.post("/api/recipe/addFile", data)
      .then(res => { // then print response status
        console.log(res.statusText)
      })
}

// control upload image (need to fix)
const RecipeImage =()=>
{


  return(
    <div>
      <form>
        <input type='file' accept="image/png, image/gif, image/jpeg" onChange={enterFile}/>
        <button onClick={uploadFile}>Upload</button>
      </form>
      {
        <img alt='uploaded file' height="auto" />
      }
    </div>
  );
}



export function Modal({show, setShow}) {

  const [title, setTitle] = useState("recipe name");
  const [desc, setDesc] = useState("description");
  const [email, setMail] = useState("e-mail");
  const [ingreList, setIngreList] = useState([]);
  const [stepList, setStepList] = useState([]);
  const [stepText, setStepText] = useState("");

  const [fullRecipeInfo, updateFullRecipeInfo] = useState({
    title: "",
    desc: "",
    image: "",
    email: "",
    ingredients: [],
    instructions: []
  });

  useEffect(() => {
    updateFullRecipeInfo({
      ...fullRecipeInfo,
      title: title,
      desc: desc,
      email: email,
      ingredients: ingreList,
      instructions: stepList
    });
  }, [title, desc, email, ingreList, stepList,])
  



  function postRrecipe(){
    // add step Text to step List if it is not empty
    if (stepText != ""){
    stepList.push( stepText);
    }
    
    console.log(fullRecipeInfo)


    ///

    /// code to sending a data to firebase (need to code)

    ///


    setTitle("recipe name")
    setDesc("description")
    setMail("e-mail")
    setIngreList([])
    setStepList([])
    setStepText("")

    setShow(false)
  }



  if (show) {
    return (
      <div id="overlay">
        <div id="content"　>
          <div className="container container-column">
            <div className = "putLeft"> <button className="close" onClick={() => setShow(false)}>Close</button></div>
            {/* top part */}
            <div className="flex_first-box">
              <div className="flex_first-item">  </div>
              <div className="flex_first-item">
                <RecipeImage />
              </div>
              <div className="flex_first-item">
                <div className="postConfirm"> <a href ="#" onClick={()=>postRrecipe()} >Post Now</a> </div>
                <div>
                <p className='modalTitle'>Title</p>
                <input className='inputTitle' value={title} onChange={(event) => setTitle(event.target.value)} />
                <p className='modalTitle'>Description</p>
                <textarea className="modalRecipeDesc" value={desc} onChange={(event) => setDesc(event.target.value)} ></textarea>
                <p className='modalTitle'>E-mail</p>
                <input className='inputEmail' value={email} onChange={(event) => setMail(event.target.value)} ></input>
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

