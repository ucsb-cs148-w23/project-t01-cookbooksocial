// newTea function for post tea route
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
} from "firebase/firestore";

import { getStorage, deleteObject, ref } from "firebase/storage";

const addRecipe = async (req, res, next) => {
    /*
    Use bus boy, not formidable.

    */
    try {
        // console.log(storageRef._location.bucket + '/' + storageRef._location.path_);

        // const bb = busboy({ headers: req.headers });

        console.log("\nINSIDE OF RECIPE\n");

        let recipe = [];

        // bb.on('field', (name, val, info) => {
        recipe = JSON.parse(req);
        recipe["createdAt"] = serverTimestamp();
        console.log(recipe);
        // });

        const res = await addDoc(collection(db, "recipes"), recipe);

        res.writeHead(200, { Connection: "close" });
        //   res.status(200).send(`Document edited with ID: ${docRef.id}`)
    } catch (e) {
        res.status(400).send(`Error: ${e.message}`);
        console.error(e);
    }
};

const addFile = async (req, res, next) => {
    const file = req.file;
    console.log(file);
    if (!file) {
        const error = new Error("No file");
        error.httpStatusCode = 400;
        return next(error);
    }
    const storage = getStorage();
    // const imgRef = ref()
    res.send(file);
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
    // First need to get the recipe so we can get the image URL
    // We need the image URL so we can delete the image from storage
    const id = req.params.id;
    const docRef = doc(db, "recipes", id);
    const docSnap = await getDoc(docRef);
    let imageURL = "";
    try {
        if (docSnap.exists()) {
            imageURL = docSnap.data()['image'];
            if(imageURL === ""){
                throw new Error('ImageURL was Invalid');
            }
        } else {
            throw new Error('Recipe not found');
        }
    } catch (e) {
        res.status(400).send(`Error: ${e.message}`);
        return;
    }


    // Delete image from storage then delete whole recipe
    try{
        const storageDeleteFrom = getStorage();
        const oldImageRef = ref(storageDeleteFrom, imageURL);
        deleteObject(oldImageRef).then(async () => {
            await deleteDoc(docRef);
            res.status(200).send(`Document deleted with ID: ${docRef.id} and image deleted with URL ${imageURL}`);
        }).catch((e) => {
            res.status(400).send(`Failed to delete the image.  Error: ${e.message}`);
            return;
        });
    } catch(e){
        res.status(400).send(`Error: ${e.message}`);
        return;
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

// Gets all recipes, then gets the user for each recipe through getUser function
const getAllRecipes = async (req, res, next) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "recipes"), orderBy("createdAt")));
        const recipes = [];
        for (const doc of querySnapshot.docs) {
            let recipe = doc.data();
            recipe["id"]=doc.id; //Preserve the firebase document ID to be able to match recipes
            if (Object.hasOwn(doc.data(), "uid")) {
                const user = await getUser(doc.data().uid);
                recipe["user"] = user;
            }
            recipes.push(recipe);
        }
        res.status(200).send(recipes);
    } catch (e) {
        res.status(400).send(`Error: ${e.message}`);
    }
};

export { addRecipe, updateRecipe, deleteRecipe, getRecipe, getAllRecipes, addFile };
