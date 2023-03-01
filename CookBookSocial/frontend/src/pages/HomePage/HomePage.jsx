import React, { useEffect, useState } from "react";
import RecipePost from "../../components/recipe_posts/RecipePost";
import Navbars from "../../components/navbars/Navbars";
import PostModal from "../../components/postModal/postModal";
import SearchBar from "../../components/Search/Search";
import { FaSpinner } from "react-icons/fa";

import "./HomePage.css";

function HomePage() {
  const [recipePostsList, updateRecipePostsList] = useState([]);
  const URL_GET_RECIPE_POSTS_DATA = "/api/recipe/all";
  const [searchState, setSearchState] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY);
    };
    console.log("AHHH");
    window.addEventListener("beforeunload", handleBeforeUnload);

    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition !== null) {
      window.scrollTo(0, parseInt(scrollPosition));
    }

    fetch(URL_GET_RECIPE_POSTS_DATA)
      .then((response) => response.json())
      .then((data) => {
        updateRecipePostsList(data);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));

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

  return (
    <div>
      <Navbars />
      <SearchBar setSearchState={setSearchState} />
      <div className="max-w-2xl mx-auto my-2">
        <PostModal />
        {isLoading ? (
          <div className="loading-container">
            <FaSpinner className="loading-spinner" />
          </div>
        ) : (
          <ul>
            {recipePostsList.map((recipe, index) => (
              <RecipePost key={index} recipe={recipe} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HomePage;

