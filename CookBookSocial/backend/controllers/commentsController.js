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

    if (req.params.length === 0) {
      res.status(200).send(comments);
    }

    for (i = 0; i < req.params.length; i++) {
      const id = req.params[i];

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

    comment["createdAt"] = serverTimestamp();
    console.log(comment);


    let commentId = await addDoc(collection(db, "comments"), comment);

    commentId = commentId.id;

    



    const res = await updateDoc();

    res.status(200).send(`Comment added`);
  } catch (e) {
    res.status(400).send(`Error: ${e.message}`);
    console.error("Error adding comment: \n", e);
  }
};

export { getComments, addComment };
