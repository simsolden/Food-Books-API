import { Router } from 'express';
import { createUserPlanning, findUserPlanning, addPlanningRecipe } from '../controllers/planning';
import { auth } from '../middlewares/authentication';

const planningRouter = Router();

planningRouter.post('/planning', createUserPlanning);

planningRouter.get('/users/planning', auth, findUserPlanning);

planningRouter.put('/planning', auth, addPlanningRecipe);

export default planningRouter;
