import { Router } from 'express';
import { upload } from '../app';
import { createRecipe, findOneRecipe, findRecipes, updateRecipe, deleteRecipe } from '../controllers/recipes';
import { auth } from '../middlewares/authentication';
import { getUser } from '../middlewares/getUser';
import { pagination } from '../middlewares/recipes/pagination';

const recipesRouter = Router();

recipesRouter.get('/recipes', getUser, pagination, findRecipes);

recipesRouter.get('/recipes/:recipeId', getUser, findOneRecipe);

recipesRouter.post('/recipes', auth, createRecipe);

recipesRouter.put('/recipes/:recipeId', auth, updateRecipe);

recipesRouter.delete('/recipes/:recipeId', auth, deleteRecipe);

export default recipesRouter;
