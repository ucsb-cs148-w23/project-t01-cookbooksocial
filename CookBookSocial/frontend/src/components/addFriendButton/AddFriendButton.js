import React, { useEffect, useState } from "react";

export default function AddFriendButton({ currentUserId, profileUid, profileInfo }) {

    // Friend states:
    const FRIEND = "friend";
    const UNKNOWN = "unknown";
    const REQUEST_SENT = "request sent";
    const REQUEST_RECEIVED = "request received";
    const NOT_FRIENDED = "not friended";
    const [friendedState, setFriendedState] = useState(UNKNOWN);
    console.log(profileInfo);

    useEffect(() => {
        if('friends' in profileInfo.data){
            if(currentUserId in profileInfo.data['friends']){
                setFriendedState(FRIEND);
                return;
            } else {
                setFriendedState(NOT_FRIENDED);
                return;
            }
        } 
        if ('receivedFriendRequests' in profileInfo.data){
            if (currentUserId in profileInfo.data['receivedFriendRequests']){
                setFriendedState(REQUEST_SENT);
                return;
            }
        }
        if ('sentFriendRequests' in profileInfo.data) {
            if (currentUserId in profileInfo.data['sentFriendRequests']) {
                setFriendedState(REQUEST_RECEIVED);
                return;
            }
        }
        setFriendedState(NOT_FRIENDED);


    }, [[profileInfo]]);

    const URL_SEND_FRIEND_REQUEST = `/api/user/friend-request/${currentUserId}/${profileUid}`;
    function addFriend() {
        /*
            currentUser.uid is the user id of the current viewer/user.  userId is the id of the user profile that they are viewing.  Need both id's when making a friend request.  currentUser will have the other user id in their 'sentFriendRequests' list in firebase.  The profile being viewed will have the current user ID in their 'receivedFriendRequests' list in firebase.
        */

        const response = fetch(URL_SEND_FRIEND_REQUEST, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            console.log(data);
        });

        console.log(response);

    }

    return (
        <span
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => addFriend()}>
            Add Friend
        </span>
    )
}

