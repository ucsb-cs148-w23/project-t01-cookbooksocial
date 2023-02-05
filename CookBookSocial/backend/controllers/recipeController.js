// newTea function for post tea route
import db from "../firebase.js";
import { doc, updateDoc, addDoc, deleteDoc, collection } from "firebase/firestore";

const addRecipe = async (req, res, next) => {
    try {
        const data = req.body;
        const docRef = await addDoc(collection(db, "recipes"), data);
        res.status(200).send(`Document written with ID: ${docRef.id}`);
    } catch (e) {
        res.status(400).send(e);
    }
};

const updateRecipe = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const docRef = doc(db, "recipes", id);
        await updateDoc(docRef, data);
        res.status(200).send(`Document edited with ID: ${docRef.id}`);
    } catch (e) {
        res.status(400).send(e);
    }
};

const deleteRecipe = async (req, res, next) => {
    try {
        const id = req.params.id;
        const docRef = doc(db, "recipes", id);
        await deleteDoc(docRef);
        res.status(200).send(`Document deleted with ID: ${docRef.id}`);
    } catch (e) {
        res.status(400).send(e);
    }
};

export { addRecipe, updateRecipe, deleteRecipe };
