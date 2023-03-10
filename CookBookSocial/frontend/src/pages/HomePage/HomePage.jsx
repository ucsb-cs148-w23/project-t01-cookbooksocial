import React, { useEffect, useState } from "react";
import RecipePost from "../../components/recipe_posts/RecipePost";
import Navbars from "../../components/navbars/Navbars";
import { FaSpinner } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";

function HomePage() {
  const [recipePostsList, updateRecipePostsList] = useState([]);
  const [searchState, setSearchState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [numPosts, setNumPosts] = useState(5);

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

  const fetchMoreData = () => {
    setNumPosts(numPosts + 5);
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
            <ul>
              {recipePostsList.slice(0, numPosts).map((recipe, index) => (
                <RecipePost key={index} recipe={recipe} />
              ))}
            </ul>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default HomePage;
