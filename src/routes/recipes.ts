import { Router } from 'express';
import { upload } from '../app';
import { createRecipe, findOneRecipe, findRecipes, uploadPicture } from '../controllers/recipes';
import { auth } from '../middlewares/authentication';
import { getUser } from '../middlewares/getUser';
import { pagination } from '../middlewares/recipes/pagination';

const recipesRouter = Router();

recipesRouter.get('/recipes', getUser, pagination, findRecipes);

recipesRouter.get('/recipes/:recipeId', getUser, findOneRecipe);

recipesRouter.post('/recipes', auth, createRecipe);

// recipesRouter.put('/recipes/:recipeId', updateRecipe);

export default recipesRouter;
