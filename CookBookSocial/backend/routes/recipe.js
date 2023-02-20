import express from "express";
import {
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipe,
    getAllRecipes,
} from "../controllers/recipeController.js";

const recipeRouter = express.Router();

/**
 * @swagger
 * /api/recipe/all:
 *   get:
 *     description: Returns an array of all recipes
 *     responses:
 *       200:
 *         description: Returns an array of all recipes.
 */
recipeRouter.get("/all", getAllRecipes);

/**
 * @swagger
 * /api/recipe/{id}:
 *   get:
 *     description: Returns an individual recipe by id
 *     parameters:
 *       - name: id
 *         description: The recipe ID.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Returns an array of all recipes.
 */
recipeRouter.get("/:id", getRecipe);

/**
 * @swagger
 * /api/recipe/all:
 *   post:
 *     description: Creates a new recipe in firestore
 *     responses:
 *       200:
 *         description: Returns success message
 */
recipeRouter.post("/", addRecipe);

/**
 * @swagger
 * /api/recipe/{id}:
 *   put:
 *     description: Edits an individual recipe by id
 *     parameters:
 *       - name: id
 *         description: The recipe ID.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success message
 */
recipeRouter.put("/:id", updateRecipe);

/**
 * @swagger
 * /api/recipe/{id}:
 *   delete:
 *     description: Deletes an individual recipe by id
 *     parameters:
 *       - name: id
 *         description: The recipe ID.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success message
 */
recipeRouter.delete("/:id", deleteRecipe);

export default recipeRouter;
