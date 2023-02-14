import db from "../firebase.js";
import { setDoc, doc, collection, serverTimestamp } from "firebase/firestore";

const addUser = async (req, res, next) => {
    try {
        const uid = req.params.id;
        const data = req.body;
        await setDoc(doc(db, "users", uid), data);
        res.status(200).send(`User added with with uid: ${uid}`);
    } catch (e) {
        res.status(400).send(`Error: ${e.message}`);
        console.error(e);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const uid = req.params.id;
        const docRef = doc(db, "users", id);
        await deleteDoc(docRef);
        res.status(200).send(`User deleted with ID: ${docRef.id}`);
    } catch (e) {
        res.status(400).send(`Error: ${e.message}`);
    }
};

export { addUser, deleteUser };
