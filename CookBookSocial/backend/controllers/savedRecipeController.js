import { db } from "../firebase.js";
import { addDoc, setDoc, doc, collection, serverTimestamp } from "firebase/firestore";

const addSavedRecipe = async (req, res, next) => {
    try {
        const id = req.params.id;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const savedPosts =[];
        if (docSnap.exists() && docSnap().data.savedPosts) {
            savedPosts = docSnap.data().savedPosts
        }
        const postId = req.body;
        savedPosts = [...savedPosts,postId];

        setDoc(docRef,{savedPosts: savedPosts},{merge:true});

        res.status(400).send("Document not found");
        
    } catch (e) {
        res.status(400).send(`Error: ${e.message}`);
    }
};


export { addSavedRecipe };