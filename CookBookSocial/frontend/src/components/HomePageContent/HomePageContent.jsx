import React, { useEffect, useState } from "react";
import {Tabs, TabList, Tab, DragTabList, DragTab, PanelList, Panel, ExtraButton} from 'react-tabtab';
import * as customStyle from 'react-tabtab/lib/themes/bulma';
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


const ShowLikedRecipeConent = () =>{
  const [likedRecipePostsList, updateLikedRecipePostsList] = useState([]);

  /*
  This will fetch the list of liked recipe posts stored in the database 
  as an array of json objects. It will then save it in the state variable AllrecipePostsList.
  It will refresh and check for new posts everytime the page refreshes.
  "URL_GET_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
  the backend.
  */
  
  //change api to liked (fix here)
  const URL_GET_LIKED_RECIPE_POSTS_DATA = "/api/recipe/all";
  
    useEffect(() => {
      fetch(URL_GET_LIKED_RECIPE_POSTS_DATA)
        .then((response) => response.json())
        .then((data) => updateLikedRecipePostsList(data));
    }, []);


  const arrComponents = [];
  for (let i = 0; i < likedRecipePostsList.length; i++) {
    arrComponents.unshift(
      <RecipePost
        key={i}
        email={likedRecipePostsList[i].email}
        title={likedRecipePostsList[i].title}
        image={likedRecipePostsList[i].image}
        description={likedRecipePostsList[i].description}
        ingredients={likedRecipePostsList[i].ingredients}
        instructions={likedRecipePostsList[i].instructions}
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
        <Tab>LIKED</Tab>
      </TabList>
      <PanelList>
        <Panel>
          show all post
          <ShowAllRecipeConent/>
        </Panel>
        <Panel>
          show liked post
          <ShowLikedRecipeConent/>
        </Panel>
      </PanelList>
    </Tabs>
  )

}















// export default function temp(props) {

//   return(
//     <>
//     <Tabs>
//       <TabList>
//         <Tab>all</Tab>
//         <Tab>friends</Tab>
//         <Tab>like</Tab>
//       </TabList>

//       <TabPanel>
//         <><showAllRecipe renderAllRecipeComponents = {()=>props.renderRecipePostComponents}></showAllRecipe> </>
//       </TabPanel>
//       <TabPanel>
//         <showFriendsRecipe renderFriendsRecipeComponents = {()=>props.renderRecipePostComponents}></showFriendsRecipe> 
//       </TabPanel>
//       <TabPanel>
//         <div><showlikeRecipe renderLikeRecipeComponents = {()=>props.renderRecipePostComponents} /> </div>
//       </TabPanel>
//     </Tabs>
//     </>
//   );
// }