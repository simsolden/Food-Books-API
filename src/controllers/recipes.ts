import fs from 'fs';
import { Ingredient } from '../index.d';
import { Recipe } from '../models/recipe';

export const createRecipe = async (req: any, res: any) => {
  const recipe = new Recipe({
    title: req.body.title,
    owner: req.user._id,
    prepTime: +req.body.prepTime,
    servings: req.body.servings,
    description: req.body.description,
    categories: req.body.categories,
    prepSteps: req.body.prepSteps,
    ingredients: req.body.ingredients,
  });

  +req.body.prepTime > 60 ? recipe.set('speed', 'slow') : req.body.cookingTime > 20 && recipe.set('speed', 'medium');

  req.body.cookingTime && recipe.set('cookingTime', req.body.cookingTime);
  req.body.difficulty && recipe.set('difficulty', req.body.difficulty);
  req.body.cost && recipe.set('cost', req.body.cost);
  req.body.grade && recipe.set('grade', req.body.grade);
  req.body.pictures && recipe.set('pictures', req.body.pictures);
  req.body.type && recipe.set('type', req.body.type);
  req.body.isPrivate && recipe.set('isPrivate', req.body.isPrivate);

  try {
    // @ts-ignore
    await Recipe.validateUserAndCategories(req.user._id, req.body.categories);
    const result = await Recipe.create(recipe);

    res.status(200).json({ result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: true, message: err.message });
  }
};

export const findRecipes = async (req: any, res: any) => {
  try {
    let result;

    if (req.query.title) {
      const search = req.query.title;
      const regex = new RegExp(`.*${search}.*`, 'i');
      //To be able to use the rest of the query as a document finder, remove title
      delete req.query.title;

      if (req.query.categories) {
        const categories = req.query.categories;
        delete req.query.categories;

        result = await Recipe.find(req.query)
          .where('isPrivate')
          .equals(false)
          .where('isDraft')
          .equals(false)
          .where('title')
          .regex(regex)
          .where('categories')
          .in(categories)
          .sort('-_id')
          .sort('-_id');
      } else {
        result = await Recipe.find(req.query)
          .where('isPrivate')
          .equals(false)
          .where('isDraft')
          .equals(false)
          .where('title')
          .regex(regex)
          .sort('-_id');
      }
    } else {
      if (req.query.categories) {
        const categories = req.query.categories;
        delete req.query.categories;

        result = await Recipe.find(req.query)
          .where('isDraft')
          .equals(false)
          .where('isPrivate')
          .equals(false)
          .where('categories')
          .in(categories)
          .sort('-_id');
      } else {
        result = await Recipe.find(req.query)
          .where('isDraft')
          .equals(false)
          .where('isPrivate')
          .equals(false)
          .sort('-_id');
      }
    }

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const findOneRecipe = async (req: any, res: any) => {
  try {
    const recipeId = req.params.recipeId;
    const result = await Recipe.findOne({ _id: recipeId });

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const uploadPicture = async (req: any, res: any) => {
  if (req.file) {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(req.file.mimetype)) {
      const extension = req.file.originalname.split('.')[1];
      const newFileName = `${req.file.destination}/${req.file.filename}.${extension}`;
      await fs.rename(req.file.path, newFileName, (err: any) => {
        // throw new Error();
      });
      res.json(`${req.file.filename}.${extension}`);
    } else {
      res.status(422).json({ message: 'Unvalid format' });
    }
  } else {
    res.status(500).json({ message: 'no file' });
  }
};
