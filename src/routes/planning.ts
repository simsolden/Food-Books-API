import { Router } from 'express';
import { createUserPlanning, findUserPlanning, findOneUserPlanning } from '../controllers/planning';

const planningRouter = Router();

planningRouter.post('/planning', createUserPlanning);

planningRouter.get('/planning', findUserPlanning);

planningRouter.get('/planning/:userId', findOneUserPlanning);

export default planningRouter;
