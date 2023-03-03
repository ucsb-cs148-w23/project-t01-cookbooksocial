import React, { useEffect, useState } from "react";
import FriendRequestControl from "../FriendRequestControl/FriendRequestControl";
import './FriendRequestsDisplay.css'

export default function FriendRequestsDisplay({currentUserId}){
    const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);


    const URL_GET_USERS_FRIEND_REQUESTS = `/api/user/friend-requests/${currentUserId}`;
    useEffect(() => {
        fetch(URL_GET_USERS_FRIEND_REQUESTS)
            .then((response) => response.json())
            .then((data) => setReceivedFriendRequests(data));
    }, []);







    let receivedFriendReqDisplay = [];
    Object.keys(receivedFriendRequests).forEach(function(key) {

        if (receivedFriendRequests[key].profile){
            receivedFriendReqDisplay.push(
                <div className="friendRequest" key={receivedFriendRequests[key].uid}>{receivedFriendRequests[key].profile.displayName || receivedFriendRequests[key].profile} 
                <FriendRequestControl
                senderId = {receivedFriendRequests[key].uid}
                receiverId = {currentUserId}
                setReceivedFriendRequests = {setReceivedFriendRequests}
                />
                </div>
            );
        }
    })


    return(
        <div className="rec-friend-req-container">
            {receivedFriendRequests.length !== 0 && (
                receivedFriendReqDisplay
            )}
        </div>
    )
}   