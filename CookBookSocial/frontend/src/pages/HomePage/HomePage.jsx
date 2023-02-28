import React, { useEffect, useState } from "react";
import RecipePost from "../../components/recipe_posts/RecipePost";
import Navbars from "../../components/navbars/Navbars";
import PostModal from "../../components/postModal/postModal";
import SearchBar from "../../components/Search/Search";

import "./HomePage.css";

function HomePage() {
  //state to hold an array of json objects of recipe posts (TWO FILLER POSTS FOR NOW AS EXAMPLES)
  const [recipePostsList, updateRecipePostsList] = useState([]);
  const URL_GET_RECIPE_POSTS_DATA = "/api/recipe/all";
  const [searchState, setSearchState] = useState({});

  useEffect(() => {
    fetch(URL_GET_RECIPE_POSTS_DATA)
      .then((response) => response.json())
      .then((data) => updateRecipePostsList(data));
  }, []);

  function renderRecipePostComponents() {
    const arrComponents = [];
    for (let i = 0; i < recipePostsList.length; i++) {
      arrComponents.unshift(<RecipePost key={i} recipe={recipePostsList[i]} />);
    }
    return arrComponents;
  }

  return (
    <div>
      <Navbars />
      <SearchBar setSearchState={setSearchState} />
      <div className="max-w-2xl mx-auto my-2">
        <PostModal></PostModal>
        <ul>
          {recipePostsList.map((recipe) => (
            <RecipePost key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
