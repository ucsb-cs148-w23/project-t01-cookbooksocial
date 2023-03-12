import { collection, doc, getFirestore } from "firebase/firestore";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import RecipeList from "../../components/RecipeLists/RecipeList/RecipeList";

function RecipeListPage() {
  const id = useParams();

  useEffect(() => {
    const db = getFirestore();
    const userReference = doc(collection(db, "users"), id);
    getDoc(userReference).then((doc) => {
        const data = doc.data();
        


    });
  });

  return (
    <>
      <div>RecipeListPage</div>

      <RecipeList />
    </>
  );
}

export default RecipeListPage;
