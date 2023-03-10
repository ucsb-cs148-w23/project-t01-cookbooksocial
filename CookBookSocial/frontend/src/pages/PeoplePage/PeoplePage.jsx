import React, { useEffect, useState } from "react";
import RecipePost from "../../components/RecipePost/RecipePost";
import Navbar from "../../components/Navbar/Navbar";
import "./PeoplePage.css";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import AddFriendButton from "../../components/Friends/AddFriendButton/AddFriendButton";
// import renderRecipePostComponents from "./pages/HomePage/HomePage";
//FIXME: ProfilePage is very similar to HomePage code so probably a way to re-use

function PeoplePage() {
    const [profileRecipePostsList, updateProfileRecipePostsList] = useState([]);
    const [profileInfo, updateProfileInfo] = useState([]);
    //uses param from route :userId
    const { userId } = useParams();

    const { currentUser } = useAuth();
    const POSTS_AT_A_TIME = 5;
    const [numPosts, setNumPosts] = useState(POSTS_AT_A_TIME);

    //useAuth has information from Firebase about user, we will get email from here
    /*
  This will fetch the list of PROFILE recipe posts stored in the database 
  as an array of json objects. It will then save it in the state variable profileRecipePostsList.
  It will refresh and check for new posts everytime the page refreshes.
  "URL_GET_PROFILE_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
  the backend.
  */
    const URL_GET_PROFILE_RECIPE_POSTS_DATA = "/api/recipe/all";

    useEffect(() => {
        fetch(URL_GET_PROFILE_RECIPE_POSTS_DATA)
            .then((response) => response.json())
            .then((data) => updateProfileRecipePostsList(data));
    }, []);

    //get profile info
    useEffect(() => {
        getProfileInfo();
    }, []);
    useEffect(() => {}, [profileInfo]);

    //get user's data from firestore doc identified with their userID
    function getProfileInfo() {
        const userInfoRef = doc(db, "users", userId);

        getDoc(userInfoRef)
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    console.log("invalid user");
                    window.location.href = "/Invalid";
                }
                const profileInfData = {
                    data: snapshot.data(),
                    id: snapshot.id,
                };
                updateProfileInfo(profileInfData);
            })
            .catch((error) => console.log(error.message));
    }

    function renderProfileRecipePostComponents() {
        const arrComponents = [];
        let profilePostCount = 0; //count number of profile posts rendered, and keep under numPosts
        for (let i = 0; i < profileRecipePostsList.length && profilePostCount < numPosts; i++) {
            if (profileRecipePostsList[i].uid === userId) {
                arrComponents.unshift(<RecipePost key={i} recipe={profileRecipePostsList[i]} />);
                profilePostCount += 1;
            }
        }
        if (arrComponents.size === 0) {
            return (
                <h1 style={{ color: "blue", fontSize: "60px" }}>You currently do not have posts</h1>
            );
        } else {
            return arrComponents;
        }
    }
    const scrollCheck = () => {
        const scrollTop = document.documentElement.scrollTop; //amount scrolled from the top
        const scrollHeight = document.documentElement.scrollHeight; //total height of rendered
        const clientHeight = document.documentElement.clientHeight; //height of the window we see

        if (scrollTop + clientHeight >= scrollHeight && numPosts <= profileRecipePostsList.length) {
            //if we are at bottom, and there are more recipes, update number of recipes to show
            setNumPosts(numPosts + POSTS_AT_A_TIME);
        }
    };
    useEffect(() => {
        //when scrolling, call function to check if need to update number of posts
        document.addEventListener("scroll", scrollCheck);
        return () => document.removeEventListener("scroll", scrollCheck);
    });
    return (
        <div>
            <Navbar />
            <div className="container">
                <img
                    src={profileInfo.data?.profile ? profileInfo.data?.profile.photoURL : null}
                    className={"bioProfilePic"}
                    alt="No-Pic"
                />

                <ul>
                    <li className="bioProfileName" key={profileInfo.id}>
                        {profileInfo.data?.profile
                            ? profileInfo.data?.profile.displayName
                            : "No username"}
                    </li>
                    <li className="friend-button">
                        <AddFriendButton
                            currentUserId={currentUser.uid}
                            profileUid={userId}
                            profileInfo={profileInfo.data}
                        />
                    </li>
                </ul>
            </div>
            <div className="profile-page">
                <ul>{renderProfileRecipePostComponents()}</ul>
            </div>
        </div>
    );
}

export default PeoplePage;
