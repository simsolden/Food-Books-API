import express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import { Category } from './models/category';
import categoriesRouter from './routes/categories';
import recipesRouter from './routes/recipes';

const upload = multer({ dest: __dirname + '/public/images', limits: { fileSize: 3000000 } });

const app = express();

app.use(compression());
app.use(express.json());
app.use('/images', express.static(__dirname + '../public/images'));
app.use(categoriesRouter);
app.use(recipesRouter);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URL || 'mongodb://localhost/food-books', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {
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
