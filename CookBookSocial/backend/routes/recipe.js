import express from "express";
import { newRecipe } from "../controllers/recipeController.js";

const recipeRouter = express.Router();

recipeRouter.post("/", newRecipe);

export default recipeRouter;
