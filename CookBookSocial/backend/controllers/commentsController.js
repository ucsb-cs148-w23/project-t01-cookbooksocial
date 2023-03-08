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

    // console.log("This is the request object");
    // console.log(req);

    // console.log("This is the query length");
    // console.log(Object.keys(req.query).length);

    if (Object.keys(req.query).length === 0) {
      res.status(200).send(comments);
    } else {
      // console.log("This is the query::: ",req.query)

      for (let i = 0; i < req.query.commentsArray.length; i++) {
        const id = req.query.commentsArray[i];

        const docRef = doc(db, "comments", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          let comment = docSnap.data();
          comment["id"] = docSnap.id;

          comments.push(comment);
        }
      }

      res.status(200).send(comments);
    }
    // const comment =
  } catch (e) {
    res.status(400).send(`Error: ${e.message}`);
  }
};

const addComment = async (req, res, next) => {
  try {
    // console.log("This is the req object", req.body);
    // console
    let comment = req.body;

    // The comment object contains
    // body:
    // username:
    // userId:
    // parentId:
    // recipeId:

    comment["createdAt"] = serverTimestamp();
    // console.log("This is the comment object", comment);

    // Now the comment object contains
    // body:
    // username:
    // userId:
    // parentId:
    // recipeId:
    // createdAt:

    let commentId = await addDoc(collection(db, "comments"), comment);
    const commentObj = await getDoc(commentId);

    commentId = commentId.id;

    const recipeRef = doc(db, "recipes", comment.recipeId);

    const recipeDocSnap = await getDoc(recipeRef);
    let recipe = recipeDocSnap.data();

    let comments = recipe["comments"];
    // // We update the comments array from the recipe object
    comments.push(commentId);
    recipe["comments"] = comments;

    await updateDoc(recipeRef, recipe);

    console.log("This is the comment object", commentObj.data());

    res.status(200).send(commentObj.data());
  } catch (e) {
    res.status(400).send(`Error: ${e.message}`);
    console.error("Error adding comment: \n", e);
  }
};

export { getComments, addComment };
