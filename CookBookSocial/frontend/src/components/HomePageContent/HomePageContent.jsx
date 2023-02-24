import React, { useEffect, useState } from "react";
import {Tabs, TabList, Tab, DragTabList, DragTab, PanelList, Panel, ExtraButton} from 'react-tabtab';
import customStyle from "./HomeTab.js";
import RecipePost from "../../components/recipe_posts/RecipePost";

const ShowAllRecipeConent = () =>{

  /*
  This will fetch the list of all recipe posts stored in the database 
  as an array of json objects. It will then save it in the state variable AllrecipePostsList.
  It will refresh and check for new posts everytime the page refreshes.
  "URL_GET_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
  the backend.
  */
  
  //api is all
  const [recipePostsList, updateRecipePostsList] = useState([]);
  const URL_GET_SAVED_RECIPE_POSTS_DATA = "/api/recipe/all";
  
    useEffect(() => {
      fetch(URL_GET_SAVED_RECIPE_POSTS_DATA)
        .then((response) => response.json())
        .then((data) => updateRecipePostsList(data));
    }, []);


  const arrComponents = [];
  for (let i = 0; i <  recipePostsList.length; i++) {
    arrComponents.unshift(<RecipePost key={i} recipe={recipePostsList[i]} />);
  }

  return(
    arrComponents
  )
  
}


const ShowFriendsRecipeConent = () =>{

  /*
  This will fetch the list of friends recipe posts stored in the database 
  as an array of json objects. It will then save it in the state variable AllrecipePostsList.
  It will refresh and check for new posts everytime the page refreshes.
  "URL_GET_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
  the backend.
  */
  
  //change api to friends recipe(fix here)
  const [recipePostsList, updateRecipePostsList] = useState([]);
  const URL_GET_SAVED_RECIPE_POSTS_DATA = "/api/recipe/all";
  
    useEffect(() => {
      fetch(URL_GET_SAVED_RECIPE_POSTS_DATA)
        .then((response) => response.json())
        .then((data) => updateRecipePostsList(data));
    }, []);


  const arrComponents = [];
  for (let i = 0; i <  recipePostsList.length; i++) {
    arrComponents.unshift(<RecipePost key={i} recipe={recipePostsList[i]} />);
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
