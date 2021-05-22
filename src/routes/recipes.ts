import { Router } from 'express';
import { upload } from '../app';
import { createRecipe, findOneRecipe, findRecipes, uploadPicture } from '../controllers/recipes';
import { auth } from '../middlewares/authentication';

const recipesRouter = Router();

recipesRouter.get('/recipes', findRecipes);

recipesRouter.get('/recipes/:recipeId', findOneRecipe);

recipesRouter.post('/recipes', auth, createRecipe);

// recipesRouter.put('/recipes/:recipeId', updateRecipe);

export default recipesRouter;
