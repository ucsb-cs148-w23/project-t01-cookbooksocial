// newTea function for post tea route
import db from "../firebase.js";
import {
    doc,
    getDoc,
    getDocs,
    updateDoc,
    addDoc,
    deleteDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";

const addRecipe = async (req, res, next) => {
    try {
        const data = req.body;
        data.createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, "recipes"), data);
        res.status(200).send(`Document written with ID: ${docRef.id}`);
    } catch (e) {
        res.status(400).send(`Error: ${e.message}`);
        console.error(e);
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
        res.status(400).send(`Error: ${e.message}`);
    }
};

const deleteRecipe = async (req, res, next) => {
    try {
        const id = req.params.id;
        const docRef = doc(db, "recipes", id);
        await deleteDoc(docRef);
        res.status(200).send(`Document deleted with ID: ${docRef.id}`);
    } catch (e) {
        res.status(400).send(`Error: ${e.message}`);
    }
};

const getRecipe = async (req, res, next) => {
    try {
        const id = req.params.id;
        const docRef = doc(db, "recipes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            res.status(200).send(docSnap.data());
        } else {
            // doc.data() will be undefined in this case
            res.status(400).send("Document not found");
        }
    } catch (e) {
        res.status(400).send(`Error: ${e.message}`);
    }
};

const getAllRecipes = async (req, res, next) => {
    try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const recipes = [];
        querySnapshot.forEach((doc) => {
            recipes.push(doc.data());
        });
        res.status(200).send(recipes);
    } catch (e) {
        res.status(400).send(`Error: ${e.message}`);
    }
};

export { addRecipe, updateRecipe, deleteRecipe, getRecipe, getAllRecipes };
