import React, { useEffect, useState } from "react";
import RecipePost from "../../components/recipe_posts/RecipePost";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from "../../contexts/AuthContext";
import Navbars from "../../components/navbars/Navbars";
import { FaSpinner } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import "./HomePage.css";

function HomePage() {
  const [recipePostsList, updateRecipePostsList] = useState([]);
  const [allRecipePostsList, updateAllRecipePostsList] = useState([]);
  const [searchState, setSearchState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [friendsList, setFriendsList] = useState({});
  const { currentUser } = useAuth();

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
    const URL_GET_FRIENDS_LIST = `/api/user/friendsList/${currentUser.uid}`;
    fetch(URL_GET_FRIENDS_LIST)
    .then((response) => response.json())
    .then((data) => {
      var friendsID = Object.keys(data);
      setFriendsList(friendsID )
    })

    fetch("/api/recipe/all")
      .then((response) => response.json())
      .then((data) => {
        updateRecipePostsList(data);
        updateAllRecipePostsList(data)
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

  const filterByFriends = async() =>{
    setIsLoading(true)
    
    fetch("/api/recipe/all")
      .then((response) => response.json())
      .then((data) => {
        updateRecipePostsList(data.filter(recipePost=> {return friendsList.includes(recipePost.uid)}) )
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }

  const filterByAll = () =>{
    setIsLoading(true);
    fetch("/api/recipe/all")
    .then((response) => response.json())
    .then((data) => {
      updateRecipePostsList(data);
      setIsLoading(false);
    })
    .catch((error) => console.log(error));
  }

  const filterBylikes = () =>{
    setIsLoading(true);
    const LIKE_AT_LEAST = 3
    fetch("/api/recipe/all")
    .then((response) => response.json())
    .then((data) => {
      updateRecipePostsList(data.filter(recipePost=> {return recipePost.likesByUid.length >= LIKE_AT_LEAST}));
      setIsLoading(false);
    })
    .catch((error) => console.log(error));
  }

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
          <>
          <div>
            <div className="filterbox">
              <a  onClick={filterByAll} class="filter-btn"><span>All</span></a>
              <a  onClick={filterByFriends} class="filter-btn"><span>Friends</span></a>
              <a  onClick={filterBylikes} class="filter-btn"><span>Popular</span></a>
            </div>
          </div>
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
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
