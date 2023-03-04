import React, { useState } from "react";
import './FriendRequestControl.css'
import CancelFriendRequest from "../cancelFriendRequest/cancelFriendRequest";

export default function FriendRequestControl({senderId, receiverId, setReceivedFriendRequests}){

    const [isLoading, setIsLoading] = useState(false);

    const URL_GET_USERS_FRIEND_REQUESTS = `/api/user/friend-requests/${receiverId}`;

    function reloadFriendReqs() {
        fetch(URL_GET_USERS_FRIEND_REQUESTS)
            .then((response) => response.json())
            .then((data) => setReceivedFriendRequests(data))
            .then(() => setIsLoading(false));
    }

    function acceptFriend(senderId) {
        setIsLoading(true);
        const URL_ACCEPT_FRIEND_REQUEST = `/api/user/friend-accept/${receiverId}/${senderId}`;
        const response = fetch(URL_ACCEPT_FRIEND_REQUEST, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            console.log(data);
            reloadFriendReqs();
        });

        console.log(response);

    }

    async function rejectFriend(senderId) {
        setIsLoading(true);
        await CancelFriendRequest(receiverId, senderId).then(function (data) {
            console.log(data);
            reloadFriendReqs();
        });

    }

    if(!isLoading){
        return( 
    
            <span>
            <span className="rec-friend-req-btn text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                onClick={() => acceptFriend(senderId)}
            >
                Accept</span>
        
            <span className="rec-friend-req-btn text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                onClick={() => rejectFriend(senderId)}
            >
                Reject</span>
        
        
        
        
        </span>)
    } else {
        return (
            <span className="friendRequest" key={senderId}>
                <span className="friend-request-loader"></span>
        </span>)
    }
    
}