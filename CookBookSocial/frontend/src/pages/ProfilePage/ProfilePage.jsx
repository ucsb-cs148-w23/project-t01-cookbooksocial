import React, { useEffect, useState } from "react";
import RecipePost from "../../components/recipe_posts/RecipePost";
import Navbars from "../../components/navbars/Navbars";
import PostModal from "../../components/postModal/postModal";
import "./ProfilePage.css";
import { useAuth } from "../../contexts/AuthContext";

// import renderRecipePostComponents from "./pages/HomePage/HomePage";
//FIXME: ProfilePage is very similar to HomePage code so probably a way to re-use

function ProfilePage() {
  const [profileRecipePostsList, updateProfileRecipePostsList] = useState([]);
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

  useEffect(() => {
    fetch(URL_GET_PROFILE_RECIPE_POSTS_DATA)
      .then((response) => response.json())
      .then((data) => updateProfileRecipePostsList(data));
  }, []);

  function renderProfileRecipePostComponents() {
    const arrComponents = [];
    for (let i = 0; i < profileRecipePostsList.length; i++) {
      if (profileRecipePostsList[i].email === currentUser.email) {
        arrComponents.unshift(
          <RecipePost
            key={i}
            email={profileRecipePostsList[i].email}
            title={profileRecipePostsList[i].title}
            image={profileRecipePostsList[i].image}
            description={profileRecipePostsList[i].description}
            ingredients={profileRecipePostsList[i].ingredients}
            instructions={profileRecipePostsList[i].instructions}
          />
        );
      }
    }
    if (arrComponents.size === 0) {
      return (
        <h1 style={{ color: "blue", fontSize: "60px" }}>
          You currently do not have posts
        </h1>
      );
    } else {
      return arrComponents;
    }
  }

  return (
    <div>
      <Navbars />
      <div className="profile-page">
        <PostModal></PostModal>
        <ul>{renderProfileRecipePostComponents()}</ul>
      </div>
    </div>
  );
}

export default ProfilePage;
