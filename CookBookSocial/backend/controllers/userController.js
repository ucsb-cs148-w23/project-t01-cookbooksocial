import { db } from "../firebase.js";
import { setDoc, doc, collection, serverTimestamp, getDoc, updateDoc } from "firebase/firestore";

const addUser = async (req, res, next) => {
    try {
        const uid = req.params.id;
        const data = req.body;
        data["createdAt"] = serverTimestamp();
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

const sendFriendRequest = async (req, res, next) => {
    try{
        const idSentFrom = req.query.idSent;
        const idSentTo = req.query.idReceived;
        const docRefSent = doc(db, "users", idSentFrom);
        const docRefReceived = doc(db, "users", idSentTo);

        const docSnapSend = await getDoc(docRefSent);
        const docSnapRec = await getDoc(docRefReceived);

        if(!docSnapSend.exists() || !docSnapRec.exists() ){
            throw new Error("One of these users does not exist!");
        }

        const updateDataSend = docSnapSend.data();
        const updateDataRec = docSnapRec.data();

        if("sentFriendRequests" in updateDataSend){
            if(updateDataSend['sentFriendRequests'].includes(idSentTo)){
                throw new Error("Already sent friend request to them.");

            } else {
                updateDataSend['sentFriendRequests'].push(idSentTo);
            }
        } else {
            updateDataSend['sentFriendRequests'] = [ idSentTo ];
        }

        if("receivedFriendRequests" in updateDataRec){
            if(updateDataRec['receivedFriendRequests'].includes(idSentFrom)){
                throw new Error(" WARNING: They have already received your friend request.  THIS SHOULD NOT HAPPEN");
            } else {
                updateDataRec['receivedFriendRequests'].push(idSentFrom);
            }
        } else {
            updateDataRec['receivedFriendRequests'] = [ idSentFrom ];
        }

        await updateDoc(docRefSent, updateDataSend);
        await updateDoc(docRefReceived, updateDataRec);

        res.status(200).send(`Success.  Friend Request Sent.`);




    } catch(e){
        res.status(400).send(`Error: ${e}`);
        return;
    }
}

export { addUser, deleteUser, sendFriendRequest };
