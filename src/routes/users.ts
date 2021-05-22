import { Router } from 'express';
import { createUser, findUsers, findOneUser, updateUser, login, findUserRecipe } from '../controllers/users';
import { auth } from '../middlewares/authentication';

const usersRouter = Router();

usersRouter.post('/users', createUser);

usersRouter.post('/login', login);

usersRouter.get('/users', findUsers);

usersRouter.get('/users/recipes', auth, findUserRecipe);

usersRouter.get('/users/:userId', findOneUser);

usersRouter.put('/users/:userId', updateUser);

export default usersRouter;
