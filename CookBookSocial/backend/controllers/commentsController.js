import { db } from "../firebase.js";

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
} from "firebase/firestore";

import { getStorage, deleteObject, ref } from "firebase/storage";

const getComments = async (req, res, next) => {
  try {
    // Look up the array of comments

    const comments = [];

    if (req.params.comments.length === 0) {
      res.status(200).send(comments);
    }

    for (i = 0; i < req.params.comments.length; i++) {
      const id = req.params.comments[i];

      const docRef = doc(db, "comments", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        comments.push(docSnap.data());
      }
    }

    res.status(200).send(comments);

    // const comment =
  } catch (e) {
    res.status(400).send(`Error: ${e.message}`);
  }
};

const addComment = async (req, res, next) => {
  try {
    let comment = JSON.parse(req);

    // The comment object contains
    // body:
    // username:
    // userId:
    // parentId:
    // recipeId:

    comment["createdAt"] = serverTimestamp();
    console.log(comment);

    // Now the comment object contains
    // body:
    // username:
    // userId:
    // parentId:
    // recipeId:
    // createdAt:

    let commentId = await addDoc(collection(db, "comments"), comment);

    commentId = commentId.id;

    const recipeRef = db.collection("recipes").doc(comment.recipeId);

    const recipeDocSnap = await getDoc(recipeRef);
    let recipe = recipeDocSnap.data();

    let comments = recipe["comments"];
    // We update the comments array from the recipe object
    comments.push(commentId);
    recipe["comments"] = comments;

    const res = await recipeRef.update(recipeRef, recipe);

    // const res = await updateDoc();

    res.status(200).send(`Comment added`);
  } catch (e) {
    res.status(400).send(`Error: ${e.message}`);
    console.error("Error adding comment: \n", e);
  }
};

export { getComments, addComment };
