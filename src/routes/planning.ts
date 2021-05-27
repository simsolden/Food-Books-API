import { Router } from 'express';
import { findUserPlanning, addPlanningRecipe, updatePlanning } from '../controllers/planning';
import { auth } from '../middlewares/authentication';

const planningRouter = Router();

planningRouter.get('/users/planning', auth, findUserPlanning);

planningRouter.post('/users/planning', auth, addPlanningRecipe);

planningRouter.put('/users/planning', auth, updatePlanning);

export default planningRouter;
