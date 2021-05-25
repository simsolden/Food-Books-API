import { Router } from 'express';
import { createUser, findUsers, findOneUser, updateUser, login, findUserRecipes } from '../controllers/users';
import { auth } from '../middlewares/authentication';
import { pagination } from '../middlewares/users/pagination';

const usersRouter = Router();

usersRouter.post('/users', createUser);

usersRouter.post('/login', login);

usersRouter.get('/users', findUsers);

usersRouter.get('/users/recipes', auth, pagination, findUserRecipes);

usersRouter.get('/users/:userId', findOneUser);

usersRouter.put('/users/:userId', updateUser);

export default usersRouter;
