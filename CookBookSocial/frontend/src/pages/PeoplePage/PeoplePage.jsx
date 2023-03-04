import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import RecipePost from "../../components/recipe_posts/RecipePost";
import Navbars from "../../components/navbars/Navbars";
import PostModal from "../../components/postModal/postModal";
import "./PeoplePage.css";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import AddFriendButton from "../../components/addFriendButton/AddFriendButton";
// import renderRecipePostComponents from "./pages/HomePage/HomePage";
//FIXME: ProfilePage is very similar to HomePage code so probably a way to re-use

function PeoplePage() {
    const [profileRecipePostsList, updateProfileRecipePostsList] = useState([]);
    const [profileInfo, updateProfileInfo] = useState([]);
    //uses param from route :userId
    const { userId } = useParams();

    const { currentUser } = useAuth();

    //useAuth has information from Firebase about user, we will get email from here
    /*
  This will fetch the list of PROFILE recipe posts stored in the database 
  as an array of json objects. It will then save it in the state variable profileRecipePostsList.
  It will refresh and check for new posts everytime the page refreshes.
  "URL_GET_PROFILE_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
  the backend.
  */
    const URL_GET_PROFILE_RECIPE_POSTS_DATA = "/api/recipe/all";

    // console.log("Current User: ",currentUser);
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
                console.log("data to update with", profileInfData.data.email);
                updateProfileInfo(profileInfData);
            })
            .catch((error) => console.log(error.message));
    }

    function renderProfileRecipePostComponents() {
        const arrComponents = [];
        for (let i = 0; i < profileRecipePostsList.length; i++) {
            if (profileRecipePostsList[i].uid === userId) {
                arrComponents.unshift(<RecipePost key={i} recipe={profileRecipePostsList[i]} />);
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

    // console.log(profileInfo)
    return (
        <div>
            <Navbars />
            <Container>
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
            </Container>
            <div className="profile-page">
                <ul>{renderProfileRecipePostComponents()}</ul>
            </div>
        </div>
    );
}

export default PeoplePage;
