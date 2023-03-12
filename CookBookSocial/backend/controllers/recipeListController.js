import { db } from "../firebase.js";
import { getAuth } from "firebase-admin/auth";
import { getUser } from "../controllerFunctions/userFunctions.js";
import {
  query,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  orderBy,
  setDoc,
} from "firebase/firestore";

import { getStorage, deleteObject, ref } from "firebase/storage";

const getRecipeList = async (req, res, next) => {
  try {
    const recipes = [];

    if (Object.keys(req.query).length === 0) {
      res.status(200).send(recipes);
    } else {
      // We traverse throught the recipes array
      for (let i = 0; i < req.query.recipesArray.length; i++) {
        const id = req.query.recipesArray[i];

        const docRef = doc(db, "recipes", id);
        const docSnap = await getDoc(docRef);

        // We check if the doc exists
        if (docSnap.exists()) {
          // If doc exists, we retrieve its data, and set the id field to be the docId.
          // Then we push this comment into the array
          let recipe = docSnap.data();
          recipe["id"] = docSnap.id;

          recipes.push(recipe);
        }
      }

      // We return the recipes array
      res.status(200).send(recipes);
    }
  } catch (e) {
    res.status(400).send(`Error: ${e.message}`);
  }
};

export { getRecipeList };
