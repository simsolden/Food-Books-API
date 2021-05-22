import { Router } from 'express';
import { createUserFavourites, findUserFavourites, findOneUserFavourites } from '../controllers/favourites';

const favouritesRouter = Router();

favouritesRouter.get('/favourites', findUserFavourites);

favouritesRouter.get('/favourites/:userId', findOneUserFavourites);

favouritesRouter.post('/favourites', createUserFavourites);

export default favouritesRouter;
