import { Router } from 'express';
import { createCategory, findCategories, findOneCategory } from '../controllers/categories';

const categoriesRouter = Router();

categoriesRouter.post('/categories', createCategory);

categoriesRouter.get('/categories', findCategories);

categoriesRouter.get('/categories/:categoryId', findOneCategory);

export default categoriesRouter;
