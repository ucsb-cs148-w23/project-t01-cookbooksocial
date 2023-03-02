import express from "express";
import {
    addSavedRecipe,
} from "../controllers/savedRecipeController.js";

const savedRecipeRouter = express.Router();

/**
 * @swagger
 * /api/recipe/all:
 *   post:
 *     description: Saved a recipe in firestore
 *     responses:
 *       200:
 *         description: Returns success message
 */
savedRecipeRouter.add("/savedRecipes/:id", addSavedRecipe);