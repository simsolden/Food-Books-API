import { Router } from 'express';
import { createUser, updateUser, login, findUserRecipes, autoLogin, verifyAddress } from '../controllers/users';
import { auth } from '../middlewares/authentication';
import { pagination } from '../middlewares/users/pagination';
import { userBruteforce, globalBruteforce } from '../common/ExpressBrute';

const usersRouter = Router();

usersRouter.post('/users', globalBruteforce.prevent, createUser);

usersRouter.post(
  '/login',
  globalBruteforce.prevent,
  userBruteforce.getMiddleware({
    key: (req, res, next) => {
      // prevent too many attempts for the same username
      next(req.body.email);
    },
  }),
  login
);

usersRouter.get('/confirmation', auth, verifyAddress);

usersRouter.get('/auto-login', globalBruteforce.prevent, auth, autoLogin);

// usersRouter.get('/users', findUsers);

usersRouter.get('/users/recipes', auth, pagination, findUserRecipes);

// usersRouter.get('/users/:userId', findOneUser);

usersRouter.put('/users/:userId', auth, updateUser);

export default usersRouter;
