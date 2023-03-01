import React, { useEffect, useState } from "react";
import './FriendRequestsDisplay.css'

export default function FriendRequestsDisplay({currentUserId}){
    const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);


    const URL_GET_USERS_FRIEND_REQUESTS = `/api/user/friend-requests/${currentUserId}`;
    useEffect(() => {
        fetch(URL_GET_USERS_FRIEND_REQUESTS)
            .then((response) => response.json())
            .then((data) => setReceivedFriendRequests(data));
    }, []);

    function reloadFriendReqs() {
        fetch(URL_GET_USERS_FRIEND_REQUESTS)
            .then((response) => response.json())
            .then((data) => setReceivedFriendRequests(data));
    }


    function acceptFriend(senderId) {
        const URL_ACCEPT_FRIEND_REQUEST = `/api/user/friend-accept/${currentUserId}/${senderId}`;
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

    function rejectFriend(senderId) {
        const URL_REJECT_FRIEND_REQUEST = `/api/user/friend-reject/${currentUserId}/${senderId}`;
        const response = fetch(URL_REJECT_FRIEND_REQUEST, {
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

    let receivedFriendReqDisplay = [];
    Object.keys(receivedFriendRequests).forEach(function(key) {
        receivedFriendReqDisplay.push(
            <div className="friendRequest" key={receivedFriendRequests[key].uid}>{receivedFriendRequests[key].profile.displayName || receivedFriendRequests[key].profile}
                <span className="rec-friend-req-btn text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                    onClick={() => acceptFriend(receivedFriendRequests[key].uid)}
                >
                    Accept</span>

                <span className="rec-friend-req-btn text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => rejectFriend(receivedFriendRequests[key].uid)}
                >
                    Reject</span>



                
            </div>
        );
    })
    // receivedFriendReqDisplay = receivedFriendRequests.map((friendReq) => (
    //     <div className="friendRequest" key={friendReq.uid}>{friendReq.profile.displayName || friendReq.email}
    //         <span className="rec-friend-req-btn bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
    //             onClick={() => acceptFriend(friendReq.uid)}
    //         >
    //             Accept</span>
    //     </div>
    // ));

    return(
        <div className="rec-friend-req-container">
            {receivedFriendRequests.length !== 0 && (
                receivedFriendReqDisplay
            )}
        </div>
    )
}   