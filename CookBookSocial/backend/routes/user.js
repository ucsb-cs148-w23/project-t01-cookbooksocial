import express from "express";
import { addUser, sendFriendRequest, acceptFriendRequest, getFriendRequests, rejectFriendRequest, unfriend,getFriendsList } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/:id", addUser);
userRouter.get("/friend-requests/:id", getFriendRequests);
userRouter.put("/friend-request/:idSent/:idReceived", sendFriendRequest);
userRouter.put("/friend-accept/:idReceived/:idSent", acceptFriendRequest);
userRouter.put("/friend-reject/:idReceived/:idSent", rejectFriendRequest);
userRouter.put("/unfriend/:idReceived/:idSent", unfriend);
userRouter.get("/friendsList/:uid", getFriendsList);

export default userRouter;
