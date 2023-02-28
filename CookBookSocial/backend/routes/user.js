import express from "express";
import { addUser, sendFriendRequest, acceptFriendRequest, getFriendRequests } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/:id", addUser);
userRouter.get("/friend-requests/:id", getFriendRequests);
userRouter.put("/friend-request/:idSent/:idReceived", sendFriendRequest);
userRouter.put("/friend-accept/:idReceived/:idSent", acceptFriendRequest)

export default userRouter;
