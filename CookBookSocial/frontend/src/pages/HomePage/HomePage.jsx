import React, { useEffect, useState } from "react";
import RecipePost from "../../components/recipe_posts/RecipePost";
import Navbars from "../../components/navbars/Navbars";
import { FaSpinner } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import "./HomePage.css";

function HomePage() { //test
  const [recipePostsList, updateRecipePostsList] = useState([]);
  const [searchState, setSearchState] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const POSTS_AT_A_TIME = 5;
  const [numPosts, setNumPosts] = useState(
    parseInt(sessionStorage.getItem("numPosts")) || POSTS_AT_A_TIME
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition !== null) {
      window.scrollTo(0, parseInt(scrollPosition));
    }

    fetch("/api/recipe/all")
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
      document.documentElement.style.scrollBehavior = "smooth";
      window.scrollTo(0, parseInt(scrollPosition));
    }
  }, [recipePostsList]);

  const fetchMoreData = () => {
    setNumPosts((prevNumPosts) => prevNumPosts + POSTS_AT_A_TIME);
    sessionStorage.setItem("numPosts", numPosts + POSTS_AT_A_TIME);
  };

  return (
    <div>
      <Navbars />
      <div className="mt-8"></div>
      <div className="max-w-2xl mx-auto my-2">
        {isLoading ? (
          <div className="loading-container">
            <FaSpinner className="loading-spinner" />
          </div>
        ) : (
          <InfiniteScroll
            dataLength={numPosts}
            next={fetchMoreData}
            hasMore={numPosts < recipePostsList.length}
            loader={
              <div className="loading-container">
                <FaSpinner className="loading-spinner" />
              </div>
            }
          >
            {recipePostsList.slice(0, numPosts).map((recipe, index) => (
              <RecipePost key={index} recipe={recipe} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default HomePage;
