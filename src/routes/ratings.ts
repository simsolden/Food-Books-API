import { Router } from 'express';
import { createUserRatings, findOneUserRatings, findUserRatings } from '../controllers/ratings';

const ratingsRouter = Router();

ratingsRouter.post('/ratings', createUserRatings);

ratingsRouter.get('/ratings', findUserRatings);

ratingsRouter.get('/ratings/:userId', findOneUserRatings);

export default ratingsRouter;
