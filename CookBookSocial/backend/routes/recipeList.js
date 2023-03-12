import express from "express";

const recipeListRouter = express.Router();

recipeListRouter.get("/", getRecipeList)

export default recipeListRouter;