import React, { useEffect, useState } from "react";
import {Tabs, TabList, Tab, DragTabList, DragTab, PanelList, Panel, ExtraButton} from 'react-tabtab';
import customStyle from "./HomeTab.js";
import RecipePost from "../../components/recipe_posts/RecipePost";

const ShowAllRecipeConent = () =>{
  const [allRecipePostsList, updateAllRecipePostsList] = useState([]);

  /*
  This will fetch the list of all recipe posts stored in the database 
  as an array of json objects. It will then save it in the state variable AllrecipePostsList.
  It will refresh and check for new posts everytime the page refreshes.
  "URL_GET_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
  the backend.
  */
  
  //api is all
  const URL_GET_ALL_RECIPE_POSTS_DATA = "/api/recipe/all";
  
    useEffect(() => {
      fetch(URL_GET_ALL_RECIPE_POSTS_DATA)
        .then((response) => response.json())
        .then((data) => updateAllRecipePostsList(data));
    }, []);


  const arrComponents = [];
  for (let i = 0; i < allRecipePostsList.length; i++) {
    arrComponents.unshift(
      <RecipePost
        key={i}
        email={allRecipePostsList[i].email}
        title={allRecipePostsList[i].title}
        image={allRecipePostsList[i].image}
        description={allRecipePostsList[i].description}
        ingredients={allRecipePostsList[i].ingredients}
        instructions={allRecipePostsList[i].instructions}
      />
    );
  }

  return(
    arrComponents
  )
  
}


const ShowFriendsRecipeConent = () =>{
  const [friendsRecipePostsList, updateFriendsRecipePostsList] = useState([]);

  /*
  This will fetch the list of friends recipe posts stored in the database 
  as an array of json objects. It will then save it in the state variable AllrecipePostsList.
  It will refresh and check for new posts everytime the page refreshes.
  "URL_GET_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
  the backend.
  */
  
  //change api to friends recipe(fix here)
  const URL_GET_LIKED_RECIPE_POSTS_DATA = "/api/recipe/all";
  
    useEffect(() => {
      fetch(URL_GET_LIKED_RECIPE_POSTS_DATA)
        .then((response) => response.json())
        .then((data) => updateFriendsRecipePostsList(data));
    }, []);


  const arrComponents = [];
  for (let i = 0; i < friendsRecipePostsList.length; i++) {
    arrComponents.unshift(
      <RecipePost
        key={i}
        email={friendsRecipePostsList[i].email}
        title={friendsRecipePostsList[i].title}
        image={friendsRecipePostsList[i].image}
        description={friendsRecipePostsList[i].description}
        ingredients={friendsRecipePostsList[i].ingredients}
        instructions={friendsRecipePostsList[i].instructions}
      />
    );
  }

  return(
    arrComponents
  )
  
}






export default function HomePageContent () {
 

  return (
    <Tabs customStyle={customStyle}>
      <TabList>
        <Tab>ALL</Tab>
        <Tab>FRIENDS</Tab>
      </TabList>
      <PanelList>
        <Panel>
          show all post
          <ShowAllRecipeConent/>
        </Panel>
        <Panel>
          show friends post
          <ShowFriendsRecipeConent/>
        </Panel>
      </PanelList>
    </Tabs>
  )

}
