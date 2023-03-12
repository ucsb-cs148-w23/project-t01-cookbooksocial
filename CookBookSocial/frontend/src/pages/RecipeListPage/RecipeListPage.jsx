import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecipeList from "../../components/RecipeLists/RecipeList/RecipeList";

function RecipeListPage() {
  const [recipeLists, setRecipeLists] = useState([]);

  const id = useParams();

  useEffect(() => {
    const db = getFirestore();
    const userReference = doc(collection(db, "users"), id);
    getDoc(userReference).then((doc) => {
      const data = doc.data();
      if (data["recipeLists"]) {
        setRecipeLists(data["recipeLists"]);
      }
    });
  });

  const renderRecipes = () => {
    if (recipeLists.length === 0)
    {
      return <div>No Recipe lists</div>
    }
    for(let i = 0; i < recipeLists.length; i++) {
      
    }
  }

  return (
    <>
      <div>RecipeListPage</div>

      <RecipeList recipes={recipe}/>
    </>
  );
}

export default RecipeListPage;
