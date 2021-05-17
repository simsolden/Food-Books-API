import { Recipe } from '../models/recipe';

export const createRecipe = async (req: any, res: any, next: any) => {
  const recipe = new Recipe({
    title: req.body.title,
    owner: req.body.owner,
    prepTime: +req.body.prepTime,
    servings: req.body.servings,
    description: req.body.description,
    categories: req.body.categories,
    ingredients: req.body.ingredients,
    prepSteps: req.body.prepSteps,
  });

  req.body.cookingTime && recipe.set('cookingTime', req.body.cookingTime);
  req.body.difficulty && recipe.set('difficulty', req.body.difficulty);
  req.body.cost && recipe.set('cost', req.body.cost);
  req.body.grade && recipe.set('grade', req.body.grade);
  req.body.pictures && recipe.set('pictures', req.body.pictures);
  req.body.type && recipe.set('type', req.body.type);
  req.body.isPrivate && recipe.set('isPrivate', req.body.isPrivate);

  try {
    const result = await Recipe.create(recipe);

    res.status(200).json({ recipe });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const findRecipes = async (req: any, res: any, next: any) => {
  try {
    let result;

    if (req.query) {
      result = await Recipe.find(req.query);
    } else {
      result = await Recipe.find();
    }

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const findOneRecipe = async (req: any, res: any, next: any) => {
  try {
    const recipeId = req.params.recipeId;
    const result = await Recipe.findOne({ _id: recipeId });

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
