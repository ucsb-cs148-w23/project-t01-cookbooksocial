import express from "express";

import { addComment, getComments } from "../controllers/commentsController";

const commentsRouter = express.Router();

/**
 * @swagger
 * /api/comments/all:
 *   get:
 *     description: Returns an array of all comments in a post
 *     responses:
 *       200:
 *         description: Returns an array of all comments in a post.
 */
commentsRouter.get("/all", getComments);

/**
 * @swagger
 * /api/comments/all:
 *   post:
 *     description: Creates a new comment in firestore
 *     responses:
 *       200:
 *         description: Returns success message
 */
commentsRouter.post("/", addComment);

export default commentsRouter;
