import express from "express";
import { addRecipe, updateRecipe, deleteRecipe } from "../controllers/recipeController.js";

const recipeRouter = express.Router();

recipeRouter.post("/", addRecipe);
recipeRouter.put("/:id", updateRecipe);
recipeRouter.delete("/:id", deleteRecipe);

export default recipeRouter;
