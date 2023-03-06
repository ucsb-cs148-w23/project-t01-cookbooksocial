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

    const querySnapshot = getDocs(query(collection(db, "comments")));

    const comments = [];

    const docRef = doc(db, "comments", id);
    const docSnap = await getDoc(docRef);

    



  } catch (e) {
    res.status(400).send(`Error: ${e.message}`);
  }
};
