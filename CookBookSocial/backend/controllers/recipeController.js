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
import busboy from "busboy";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {v4 as uuidv4} from 'uuid';

const addRecipe = async (req, res, next) => {

    /*
    Use bus boy, not formidable.

    */
    try {

        const storage = getStorage();
        const storageRef = ref(storage, `images/${uuidv4()}`);

        // console.log(storageRef._location.bucket + '/' + storageRef._location.path_);


        const bb = busboy({ headers: req.headers });

        let recipe = []

        let imgUrl = ""

        bb.on('field', (name, val, info) => {
            recipe = JSON.parse(val);
            recipe['createdAt'] = serverTimestamp();
            console.log(recipe);
        });

        bb.on('file', (name, file, info) => {
            const {filename, encoding, mimeType} = info;
            console.log(
                `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
                filename,
                encoding,
                mimeType
            );

            file.on('data', (data) => {
                console.log(`File [${name}] got ${data.length} bytes`);

                const uploadTask = uploadBytesResumable(storageRef, data, {contentType: mimeType});
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                            recipe['image'] = downloadURL;
                            console.log(downloadURL);
                            const docRef = await addDoc(collection(db, "recipes"), recipe);

                        });
                    }
                );
            })
        })
        bb.on('finish', async function () {
            console.log('Upload complete');
            res.writeHead(200, { 'Connection': 'close' });
            res.end("Finished");
        });
        return req.pipe(bb);


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
