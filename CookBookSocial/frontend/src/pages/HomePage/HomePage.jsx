import React, { useEffect, useState } from "react";
import RecipePost from "../../components/recipe_posts/RecipePost";
import Navbars from "../../components/navbars/Navbars";
import PostModal from "../../components/postModal/postModal";
import SearchBar from "../../components/Search/Search";

import "./HomePage.css";

function HomePage() {
  const [recipePostsList, updateRecipePostsList] = useState([]);
  const URL_GET_RECIPE_POSTS_DATA = "/api/recipe/all";
  const [searchState, setSearchState] = useState({});

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition !== null) {
      window.scrollTo(0, parseInt(scrollPosition));
    }

    fetch(URL_GET_RECIPE_POSTS_DATA)
      .then((response) => response.json())
      .then((data) => updateRecipePostsList(data));

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition !== null) {
      window.scrollTo(0, parseInt(scrollPosition));
    }
  }, [recipePostsList]);

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
        <ul>{renderRecipePostComponents()}</ul>
      </div>
    </div>
  );
}

export default HomePage;
