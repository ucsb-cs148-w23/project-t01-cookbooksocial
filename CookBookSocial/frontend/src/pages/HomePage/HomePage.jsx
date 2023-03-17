import React, { useEffect, useState } from "react";
import RecipePost from "../../components/RecipePosts/RecipePost";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import { FaSpinner } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import "./HomePage.css";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [recipePostsList, setRecipePostsList] = useState([]);
  const [filteredRecipePostList, setFilteredRecipePostList] = useState([]);
  const [searchState, setSearchState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filterDis, setFilterDis] = useState(false);
  const [friendsList, setFriendsList] = useState({});
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const POSTS_AT_A_TIME = 5;
  const [numPosts, setNumPosts] = useState(
    parseInt(sessionStorage.getItem("numPosts")) || POSTS_AT_A_TIME
  );

  useEffect(() => {

    if (currentUser) {

      // If the user does not already have user data, we redirect them to the edit-profile
      if (!currentUser.displayName) {
        navigate("/edit-profile");
      }
    }

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
        setFriendsList(friendsID)
      })
      .catch((error) => console.log(error));

    fetch("/api/recipe/all")
      .then((response) => response.json())
      .then((data) => {
        //console.log("FETCHING")
        setRecipePostsList(data);
        setFilteredRecipePostList(data)
        setIsLoading(false);
        setFilterDis(false);
      //  console.log("done fetchin")
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

  const filterByAll = async() => {
    setFilterDis(true);
    setIsLoading(true);
    await setFilteredRecipePostList(recipePostsList);
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsLoading(false);
    setFilterDis(false);
  }

  const filterByFriends = async() => {
    setFilterDis(true);
    setIsLoading(true);
   await setFilteredRecipePostList(recipePostsList.filter(recipePost => friendsList.includes(recipePost.uid)));

   await new Promise(resolve => setTimeout(resolve, 400));
    setIsLoading(false);
    setFilterDis(false);
  }
  const filterByLikes = async () => {
    setFilterDis(true);
    setIsLoading(true);
    const recipePostsCopy = recipePostsList.slice();
    const top10Posts = recipePostsCopy.sort((postA, postB) => postB.likesByUid.length - postA.likesByUid.length).slice(0, 10);
    await setFilteredRecipePostList(top10Posts)
   /// console.log(top10Posts)
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsLoading(false);
    setFilterDis(false);
  }
  
  
 


  return (
    <div>
      <Navbar />
      <div className="mt-8"></div>
      <div className="max-w-2xl mx-auto my-2"> 
      <div>
          <div class="filterBox">
            <input type="radio" id="1" disabled = {filterDis} onClick={filterByAll} name="filter" defaultChecked /><label for="1">All</label>
            <input type="radio" id="2" disabled = {filterDis} onClick={filterByFriends} name="filter"/><label for="2">Friends</label>
            <input type="radio" id="3" disabled = {filterDis} onClick={filterByLikes} name="filter"/><label for="3">Popular</label>
          </div>
          <hr align="center" className="hr-line"></hr>
        </div>
        {isLoading ? (
          <div className="loading-container">
            <FaSpinner className="loading-spinner" />
          </div>
        ) : (
          <>
            <InfiniteScroll
              dataLength={numPosts}
              next={fetchMoreData}
              hasMore={numPosts < filteredRecipePostList.length}
              loader={
                <div className="loading-container">
                  <FaSpinner className="loading-spinner" />
                </div>
              }
            >
              {filteredRecipePostList.slice(0,numPosts).map((recipe, index) => (
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