/*

FrontEnd side API for POST and PUT methods

This API is in the frontend because we ran into errors with posting images.
We could not get the backend to receive the full sized image before trying to post it to Firebase
From my understanding, this made our backend make a ton of the same posts to Firebase with only fragments of the image file.
Larger images would make more duplicate posts, which I am assume is because the backend breaks the image file into more files and makes a post every time.

*/

import { ref, getDownloadURL, uploadBytesResumable, deleteObject, getStorage } from "firebase/storage";
import { storage, db } from "../config/firebase";
import { doc, setDoc, addDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import {v4 as uuidv4} from 'uuid';

async function postToFirebase(stringURL, fullRecipeInfo) {
    let postInfo = fullRecipeInfo;
    postInfo["createdAt"] = serverTimestamp();
    postInfo["image"] = stringURL;
    

    const res = await addDoc(collection(db, "recipes"), postInfo);

    if ((postInfo["categories"]).length > 0 ){
      for (let i = 0; i < (postInfo["categories"]).length; i++)
      {
      await setDoc(doc(db, "categories", (postInfo["categories"])[i]), {body: (postInfo["categories"])[i]})
      }
    }


    return res;
}


async function putToFirebase(id, stringURL, fullRecipeInfo) {
    let postInfo = fullRecipeInfo;
    postInfo["createdAt"] = serverTimestamp();
    postInfo["image"] = stringURL;
    const docRef = doc(db, "recipes", id);
    const res = await updateDoc(docRef, postInfo);


    return res;
}

export function firebaseUpload(image, fullRecipeInfo){
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `images/${uuidv4()}`);
  
      const uploadTask = uploadBytesResumable(storageRef, image);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(progress);
        },
        (error) => {
          console.log("ERROR IN UPLOAD TASK");
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  
            let response = postToFirebase(downloadURL, fullRecipeInfo);
  
            response.then(() => {
              console.log("Upload Completed:\n");
              resolve();
            });
          });
        }
      );
    });
  }
  

export function firebaseUpdateWithImage(id, image, fullRecipeInfo, oldImgURL){
    const storageRef = ref(storage, `images/${uuidv4()}`);
    console.log(oldImgURL);
    const storageDeleteFrom = getStorage();
    const oldImageRef = ref(storageDeleteFrom, oldImgURL);
    // Delete the file
    deleteObject(oldImageRef).then(() => {
        // File deleted successfully
        console.log("deleted old image successfully");
    }).catch((error) => {
        console.log("failed to delete old image: ", error);
    });



    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log(progress);
        },
        (error) => {
            console.log("ERROR IN UPLOAD TASK");
            alert(error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                let response = putToFirebase(id, downloadURL, fullRecipeInfo);

                // console.log("This is the response: ", response);
                response.then(() => {
                    console.log("Upload Completed:\n");
                });
            });
        }
    );

    return uploadTask;
}

export function firebaseUpdateWithOutImage(id, imageURL, fullRecipeInfo) {
    putToFirebase(id, imageURL, fullRecipeInfo);
}