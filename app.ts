import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import { Category } from './models/category';
import categoriesRouter from './routes/categories';
import recipesRouter from './routes/recipes';

const upload = multer({ dest: __dirname + '/public/images', limits: { fileSize: 3000000 } });

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const app = express();
app.use(express.json());
app.use('/images', express.static(__dirname + '/public/images'));
app.use(categoriesRouter);
app.use(recipesRouter);

const MONGODB_URL = process.env.DB_URL;

mongoose.connect(MONGODB_URL || 'mongodb://localhost/food-books', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async function () {
  const recipe = new Category({
    title: 'Cuisine italienne',
    description:
      'La cuisine italienne est depuis longtemps réputée comme une des meilleurs du monde. Avec ces parfums de méditérannée, elle vous emmène dans de délicieuses saveurs avec les produits de son terroir. un délice',
    pictureUri: 'petittest.jpg',
  });

  try {
    const delet = await Category.deleteMany();
    console.log(delet);
  } catch (err) {
    console.error(err);
  }
});

app.listen(3030);

app.post('/upload', upload.single('photo'), (req, res) => {
  if (req.file) {
    const extension = req.file.originalname.split('.')[1];
    const newFileName = `${req.file.destination}/${req.file.filename}.${extension}`;

    fs.rename(req.file.path, newFileName, (err) => {
      if (err) console.error(err);
    });

    res.json(`http://localhost:3030/images/${req.file.filename}.${extension}`);
  }
});
