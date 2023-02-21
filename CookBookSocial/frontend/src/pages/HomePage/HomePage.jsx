import React, { useEffect, useState } from "react";
import RecipePost from "../../components/recipe_posts/RecipePost";
import Navbars from "../../components/navbars/Navbars";
import PostModal from "../../components/postModal/postModal";

import { Button } from "react-bootstrap";

import Turkey from "../../images/turkey.jpg";
import Potatoes from "../../images/potatoes.jpg";
import { render } from "react-dom";
import "./HomePage.css";
/*
What does calling useState do? It declares a “state variable”. Our variable is called response but we could call it anything else, like banana. This is a way to “preserve” some values between the function calls. Normally, variables “disappear” when the function exits but state variables are preserved by React.
*/

function HomePage() {
  //state to hold an array of json objects of recipe posts (TWO FILLER POSTS FOR NOW AS EXAMPLES)
  const [recipePostsList, updateRecipePostsList] = useState([]);

  /*
  This will fetch the list of recipe posts stored in the database 
  as an array of json objects. It will then save it in the state variable recipePostsList.
  It will refresh and check for new posts everytime the page refreshes.
  "URL_GET_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
  the backend.
  */

  const URL_GET_RECIPE_POSTS_DATA = "/api/recipe/all";

  useEffect(() => {
    fetch(URL_GET_RECIPE_POSTS_DATA)
      .then((response) => response.json())
      .then((data) => updateRecipePostsList(data));
  }, []);

  function renderRecipePostComponents() {
    const arrComponents = [];
    for (let i = 0; i < recipePostsList.length; i++) {
      arrComponents.unshift(
        <RecipePost
          key={i}
          email={recipePostsList[i].email}
          title={recipePostsList[i].title}
          image={recipePostsList[i].image}
          description={recipePostsList[i].description}
          uid={recipePostsList[i].uid}
          ingredients={recipePostsList[i].ingredients}
          instructions={recipePostsList[i].instructions}
        />
      );
    }
    return arrComponents;
  }

  //To display the state variable in the html, use the {} curly brackets.  Simple!
  return (
    <div>
      <Navbars />
      <div className="home-page">
        <PostModal></PostModal>
        <ul>{renderRecipePostComponents()}</ul>
      </div>
    </div>
  );
}

export default HomePage;
