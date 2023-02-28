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

const getFriendRequests = async(req, res, next) => {
    try{
        const id = req.params.id;
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);


        if (docSnap.exists()) {
            const docSnapData = docSnap.data();
            if("receivedFriendRequests" in docSnapData){
                res.status(200).send(JSON.stringify(docSnapData['receivedFriendRequests']));
            } else {
                res.status(200).send(JSON.stringify({'receivedFriendRequests': []}));
            }
        } else {
            // doc.data() will be undefined in this case
            res.status(400).send("Document not found");
        }
    } catch(e){
        res.status(400).send(e);
    }
}

const sendFriendRequest = async (req, res, next) => {
    /*
    idSent is the user id of the current viewer/user that sent the friend request (the sender).  idReceived is the id of the user that they sent a friend request to.  Need both id's when making a friend request.  The sender will have the other user id in their 'sentFriendRequests' list in firebase.  The receiver will have the current user ID in their 'receivedFriendRequests' list in firebase.
*/

    try{
        const idSentFrom = req.params['idSent'];
        const idSentTo = req.params['idReceived'];
        
        if(!idSentFrom || !idSentTo){
            throw new Error("Got invalid parameters.");
        }


        if(idSentFrom === idSentTo){
            throw new Error("Cannot friend yourself!");
        }

        const docRefSent = doc(db, "users", idSentFrom);
        const docRefReceived = doc(db, "users", idSentTo);

        const docSnapSend = await getDoc(docRefSent);
        const docSnapRec = await getDoc(docRefReceived);

        if(!docSnapSend.exists() || !docSnapRec.exists() ){
            throw new Error("One of these users does not exist!");
        }

        const updateDataSend = docSnapSend.data();
        const updateDataRec = docSnapRec.data();

        if("friends" in updateDataSend){
            if (updateDataSend['friends'].includes(idSentTo)) {
                throw new Error("Already friended");

            } 
        }

        if ("friends" in updateDataRec) {
            if (updateDataRec['friends'].includes(idSentFrom)) {
                throw new Error("Already friended (This shouldn't happen)");

            }
        }



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

const acceptFriendRequest = async (req, res, next) => {
    /*
        idReceiver is the current user that is accepting a friend request.  The idSender is the one who sent the friend request.  They will both be added to eachother's friends list, and removed from 'sendFriendRequests' and 'receivedFriendRequest' lists
    */

    try {
        const idReceiver = req.params['idReceived'];
        const idSender = req.params['idSent'];

        if (!idReceiver || !idSender) {
            throw new Error("Got invalid parameters.");
        }


        if (idReceiver === idSender) {
            throw new Error("Cannot friend yourself!");
        }

        const docRefSender = doc(db, "users", idSender);
        const docRefReceiver = doc(db, "users", idReceiver);

        const docSnapSender = await getDoc(docRefSender);
        const docSnapReceiver = await getDoc(docRefReceiver);

        if (!docSnapSender.exists() || !docSnapReceiver.exists()) {
            throw new Error("One of these users does not exist!");
        }

        const updateDataSend = docSnapSender.data();
        const updateDataRec = docSnapReceiver.data();

        if ("friends" in updateDataSend) {
            if (updateDataSend['friends'].includes(idReceiver)) {
                throw new Error("Already friended");
            } else {
                updateDataSend['friends'].push(idReceiver);
            }
        } else {
            updateDataSend['friends'] = [ idReceiver ];
        }

        if ("friends" in updateDataRec) {
            if (updateDataRec['friends'].includes(idSender)) {
                throw new Error("Already friended (This shouldn't happen)");

            }else {
                updateDataRec['friends'].push(idSender);
            }
        } else {
            updateDataRec['friends'] = [idSender];
        }

        if ("sentFriendRequests" in updateDataSend) {
                // Filter will remove all occurences of idReceiver in case there was some previous error.
            updateDataSend['sentFriendRequests'] = updateDataSend['sentFriendRequests'].filter(e => e !== idReceiver);

        } 

        if ("receivedFriendRequests" in updateDataRec) {

            updateDataRec['receivedFriendRequests'] = updateDataRec['receivedFriendRequests'].filter(e => e !== idSender);

        } 



        await updateDoc(docRefSender, updateDataSend);
        await updateDoc(docRefReceiver, updateDataRec);

        res.status(200).send(`Success.  Friended.`);


    } catch(e){
        res.status(400).send(`Error: ${e}`);
        return;
    }
}

export { addUser, deleteUser, sendFriendRequest, acceptFriendRequest, getFriendRequests };
