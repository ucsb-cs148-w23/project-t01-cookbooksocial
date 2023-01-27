import logo from './logo.svg';
import './postPopUpStyles.css';
import React, { useState } from 'react';
import sampleFood from "./images/food.jpg"

//show recipe 
function ModalMain()
{
  return(
    <div>
      <h4 class="popUpTitle">Recipe Name: <input type="text" name="name" /></h4>
      <div class = "contena"> 
        <img class="popUpImage" src={sampleFood}alt = "image" />
        <textarea  class="popUpDescription"  ></textarea>
    </div>
    </div>
  )
}
//show Ingredients
function ModalIngredients()
{
  return(
    <div>
    <h4 class="popUpTitle">Ingredients: </h4>
    <div class = "contena">
         <textarea class="popUpIngredient"  ></textarea>
    </div>
    </div>
    )
}
//show how to cook
function ModalSub()
{
  return(
  <div>
    <h4 class="popUpTitle">How to cook</h4>
  <div class = "contena"> 
    <img class="popUpImage" src={sampleFood} alt = "image"/>
    <textarea  class="popUpDescription" value="tell me how to cook" ></textarea>
  </div>
  </div>
)
}
//post recipe
function ModalPost()
{
  return(
        <div>
          <h4 class="popUpTitle">You are ready to post your recipe</h4>
        <div class="popUpPost">
            <a href="" onclick="">Post Now</a>
        </div>  
        </div>

  )
}

function Modal({show, setShow}) {
  if (show) {
    return (
      <div id="overlay">
        <div id="content"　>
          <div class="container container-column">
            <div class = "putRight">
              <button class="close" onClick={() => setShow(false)}>Close</button></div>
            <div>
              <ModalMain />
            </div>
            <div>
              <ModalIngredients />
            </div>
            <div>
              <ModalSub />
            </div>
            <div>
              <ModalPost />
            </div>
          </div>
        </div>
      </div >
    )
  } else {
    return null;
  }
}
function App() {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState('Initial value');
  
  return (
     <div>
       <button onClick={() => setShow(true)}>Click</button>
       <Modal show={show} setShow={setShow} />
     </div>
   )
 }
export default App;
