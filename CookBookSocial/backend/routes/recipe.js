import express from "express";
import {
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipe,
    getAllRecipes,
} from "../controllers/recipeController.js";

const recipeRouter = express.Router();

recipeRouter.get("/all", getAllRecipes);
recipeRouter.get("/:id", getRecipe);
recipeRouter.post("/", addRecipe);
recipeRouter.put("/:id", updateRecipe);
recipeRouter.delete("/:id", deleteRecipe);

export default recipeRouter;
