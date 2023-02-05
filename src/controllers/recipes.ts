import fs from 'fs';
import { ObjectId } from 'mongodb';
import HttpException from '../common/HttpException';
import { Recipe } from '../models/recipe';
import safe from 'safe-regex';

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

  +req.body.prepTime > 60 ? recipe.set('speed', 'slow') : +req.body.cookingTime > 20 && recipe.set('speed', 'medium');

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
    if (err instanceof Error) {
      res.status(err.statusCode || 500).json({ error: true, message: err.message });
    }
  }
};

export const findRecipes = async (req: any, res: any) => {
  try {
    let result;
    const user = req.user ? req.user : new ObjectId(1);
    const sort = req.query.sort ?? '-_id';

    delete req.query.sort;

    if (req.query.title) {
      const search = req.query.title;
      const regex = new RegExp(`.*${search}.*`, 'i');
      if (!safe(regex)) {
        throw new HttpException(403, 'access refused');
      }
      //To be able to use the rest of the query as a document finder, remove title
      delete req.query.title;

      if (req.query.categories) {
        const categories = req.query.categories;
        delete req.query.categories;

        result = await Recipe.find(req.query)
          .where('owner')
          .ne(user)
          .where('isPrivate')
          .equals(false)
          .where('isDraft')
          .equals(false)
          .where('title')
          .regex(regex)
          .where('categories')
          .in(categories)
          .sort(sort)
          .limit(req.limit)
          .skip(req.startIndex);
      } else {
        result = await Recipe.find(req.query)
          .where('owner')
          .ne(user)
          .where('isPrivate')
          .equals(false)
          .where('isDraft')
          .equals(false)
          .where('title')
          .regex(regex)
          .sort(sort)
          .limit(req.limit)
          .skip(req.startIndex);
      }
    } else {
      if (req.query.categories) {
        const categories = req.query.categories;
        delete req.query.categories;

        result = await Recipe.find(req.query)
          .where('owner')
          .ne(user)
          .where('isDraft')
          .equals(false)
          .where('isPrivate')
          .equals(false)
          .where('categories')
          .in(categories)
          .sort(sort)
          .limit(req.limit)
          .skip(req.startIndex);
      } else {
        result = await Recipe.find(req.query)
          .where('owner')
          .ne(user)
          .where('isDraft')
          .equals(false)
          .where('isPrivate')
          .equals(false)
          .sort(sort)
          .limit(req.limit)
          .skip(req.startIndex);
      }
    }

    const response: any = { result };

    res.pagination && (response.pagination = res.pagination);

    res.status(200).json(response);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: true, message: err.message });
    }
  }
};

export const findOneRecipe = async (req: any, res: any) => {
  try {
    const recipeId = req.params.recipeId;
    const result = await Recipe.findOne({ _id: recipeId });

    // @ts-ignore
    if (result.isPrivate && (!req.user || req.user._id.toString() !== result.owner.toString())) {
      throw new HttpException(401, 'Unauthorized request');
    }

    res.status(200).json({ result });
  } catch (err) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({ error: true, message: err.message });
    }
  }
};

export const deleteRecipe = async (req: any, res: any) => {
  try {
    const recipeId = req.params.recipeId;
    const userId = req.user._id;

    const result = await Recipe.deleteOne({ _id: recipeId, owner: userId });

    res.status(200).json({ result });
  } catch (err) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({ error: true, message: err.message });
    }
  }
};

export const updateRecipe = async (req: any, res: any) => {
  const recipeId = req.params.recipeId;

  const recipe: any = {
    title: req.body.title,
    owner: req.user._id,
    prepTime: +req.body.prepTime,
    servings: req.body.servings,
    description: req.body.description,
    categories: req.body.categories,
    prepSteps: req.body.prepSteps,
    ingredients: req.body.ingredients,
  };

  // slow > 60 > medium > 20 > fast
  +req.body.prepTime > 60
    ? (recipe.speed = 'slow')
    : +req.body.cookingTime > 20
    ? (recipe.speed = 'medium')
    : (recipe.speed = 'fast');

  req.body.cookingTime && (recipe.cookingTime = req.body.cookingTime);
  req.body.difficulty && (recipe.difficulty = req.body.difficulty);
  req.body.cost && (recipe.cost = req.body.cost);
  req.body.grade && (recipe.grade = req.body.grade);
  req.body.pictures && (recipe.pictures = req.body.pictures);
  req.body.type && (recipe.type = req.body.type);
  req.body.isPrivate && (recipe.isPrivate = req.body.isPrivate);

  try {
    // @ts-ignore
    await Recipe.validateUserAndCategories(req.user._id, req.body.categories);
    const result = await Recipe.updateOne({ _id: recipeId }, recipe);

    res.status(200).json({ result });
  } catch (err) {
    if (err instanceof Error) {
      res.status(err.statusCode || 500).json({ error: true, message: err.message });
    }
  }
};

export const uploadPicture = async (req: any, res: any) => {
  if (req.file) {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(req.file.mimetype)) {
      const extension = req.file.mimetype.split('/')[1];
      const newFileName = `${req.file.destination}/${req.file.filename}_${req.user._id}.${extension}`;
      await fs.rename(req.file.path, newFileName, (err: any) => {
        // throw new Error();
      });
      res.json(`${req.file.filename}_${req.user._id}.${extension}`);
    } else {
      res.status(422).json({ message: 'Unvalid format' });
    }
  } else {
    res.status(500).json({ message: 'no file' });
  }
};

export const updatePicture = async (req: any, res: any) => {
  if (req.file) {
    if (['image/jpeg', 'image/png', 'image/webp', 'image/svg'].includes(req.file.mimetype)) {
      const extension = req.file.mimetype.split('/')[1];
      const newFileName = `${req.file.destination}/${req.file.filename}_${req.user._id}.${extension}`;

      await fs.rename(req.file.path, newFileName, (err: any) => {
        // throw new Error();
      });

      if (req.body.oldPicture !== 'default-recipe.jpg' && req.shouldDelete) {
        await fs.unlink(`${req.file.destination}/${req.body.oldPicture}`, (err) => {
          //throw new Error();
        });
      }

      res.json(`${req.file.filename}_${req.user._id}.${extension}`);
    } else {
      res.status(422).json({ message: 'Unvalid format' });
    }
  } else {
    res.status(500).json({ message: 'no file' });
  }
};
