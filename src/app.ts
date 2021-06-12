import express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import multer from 'multer';
import helmet from 'helmet';

import { auth } from './middlewares/authentication';
import { setHeaders } from './middlewares/corsHeaders';
import { notFoundHandler } from './middlewares/notFound';
import { verifyPicture } from './middlewares/recipes/verifyPicture';

import { uploadPicture, updatePicture } from './controllers/recipes';

import usersRouter from './routes/users';
import ratingsRouter from './routes/ratings';
import recipesRouter from './routes/recipes';
import planningRouter from './routes/planning';
import categoriesRouter from './routes/categories';
import favouritesRouter from './routes/favourites';

export const upload = multer({ dest: __dirname + '/assets', limits: { fileSize: 3000000 } });

const app = express();

app.use(compression());
app.use(express.json());
app.use(helmet());
app.use('/images', express.static(__dirname + '/assets'));
app.use(setHeaders);
app.use(categoriesRouter);
app.use(ratingsRouter);
app.use(favouritesRouter);
app.use(planningRouter);
app.use(recipesRouter);
recipesRouter.post('/recipes/update-picture', auth, upload.single('image'), verifyPicture, updatePicture);
recipesRouter.post('/recipes/upload', auth, upload.single('image'), uploadPicture);
app.use(usersRouter);
app.use(notFoundHandler);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URL || 'mongodb://localhost/food-books', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

app.listen(3030, () => console.log('listening to 3030'));
