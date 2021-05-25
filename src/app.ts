import express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import multer from 'multer';
import { errorHandler } from './middlewares/error';
import { notFoundHandler } from './middlewares/notFound';
import categoriesRouter from './routes/categories';
import ratingsRouter from './routes/ratings';
import recipesRouter from './routes/recipes';
import usersRouter from './routes/users';
import favouritesRouter from './routes/favourites';
import planningRouter from './routes/planning';
import { setHeaders } from './middlewares/corsHeaders';
import { Recipe } from './models/recipe';
import { auth } from './middlewares/authentication';
import { uploadPicture } from './controllers/recipes';
import helmet from 'helmet';

const app = express();

export const upload = multer({ dest: __dirname + '/assets', limits: { fileSize: 3000000 } });

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use('/images', express.static(__dirname + '/assets'));
app.use(setHeaders);
app.use(categoriesRouter);
app.use(ratingsRouter);
app.use(favouritesRouter);
app.use(planningRouter);
app.use(recipesRouter);
recipesRouter.post('/recipes/upload', upload.single('image'), auth, uploadPicture);
app.use(usersRouter);
app.use(errorHandler);
app.use(notFoundHandler);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URL || 'mongodb://localhost/food-books', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', async function () {
//   try {
//     await Recipe.updateMany({ categories: ['60a3c90015682d9669658992'] }, { categories: ['60a3c197ecf7a1faa480330c'] });
//   } catch (err) {
//     console.error(err);
//   }
// });

app.listen(3030, () => console.log('listening to 3030'));
