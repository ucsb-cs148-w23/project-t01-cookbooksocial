import React, { useEffect, useState } from "react";
import RecipePost from "../../components/recipe_posts/RecipePost";

const GetSavedRecipeData = () =>{
  const [recipePostsList, updateRecipePostsList] = useState([]);
  
  /*
  This will fetch the list of Saved recipe posts stored in the database. each saved file is related by "key" 
  as an array of json objects. It will then save it in the state variable AllrecipePostsList.
  It will refresh and check for new posts everytime the page refreshes.
  "URL_GET_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
  the backend.
  */


  
  //change api to get data of saved file with "file index"(fix here)
  //change api like "/api/recipe/saved(index)"
  const URL_GET_SAVED_RECIPE_POSTS_DATA = "/api/recipe/all";
  
    useEffect(() => {
      fetch(URL_GET_SAVED_RECIPE_POSTS_DATA)
        .then((response) => response.json())
        .then((data) => updateRecipePostsList(data));
    }, []);


  const arrComponents = [];
  for (let i = 0; i <  recipePostsList.length; i++) {
    arrComponents.unshift(recipePostsList[i]);
  }

  return(
    arrComponents
  )

}

const DataConvertStyle =(data)=>
{
  const arrComponents = [];
  for (let i = 0; i <  data.length; i++) {
    arrComponents.push(<RecipePost key={i} recipe={data[i]} />);
  }

  return(
    arrComponents
  )
}


export default function SavedPageContent () {
  const [data, setData] = useState(GetSavedRecipeData())
  // const [recipePostsList, updateRecipePostsList] = useState([]);
  // useEffect(() => {
  //   // declare the async data fetching function
  //   const fetchData = async () => {
  //     // get the data from the api
      
  //     const data = await ShowSavedRecipeConent();
  
  //     // set state with the result
  //     setData(data);
  //   }
  
  //   // call the function
  //   fetchData()
  //     // make sure to catch any error
  //     .catch(console.error);;
  // }, [])
  console.log(data);
 

  return (
    <>
    

    </>
  )

}
