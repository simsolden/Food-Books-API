import HttpException from '../common/HttpException';
import { Recipe } from '../models/recipe';
import { UserPlanning } from '../models/userPlanning';

export const createUserPlanning = async (req: any, res: any, next: any) => {
  const userPlanning = new UserPlanning({
    user: req.body.user,
  });

  req.body.planning && userPlanning.set('planning', req.body.planning);

  try {
    await UserPlanning.create(userPlanning);

    res.status(200).json({ userPlanning });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const addPlanningRecipe = async (req: any, res: any, next: any) => {
  const { user } = req;

  try {
    const userPlanning = await UserPlanning.findOne({ user: user._id });

    if (userPlanning) {
      // @ts-ignore
      userPlanning.planning.push(req.body.planningRecipe);

      await UserPlanning.updateOne({ _id: userPlanning._id }, userPlanning);

      res.status(200).json({ userPlanning });
    } else {
      throw new HttpException(404, "user's planning not found");
    }
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const findUserPlanning = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user._id;
    const userPlanning = await UserPlanning.findOne({ user: userId });

    if (userPlanning) {
      // @ts-ignore
      const ids = userPlanning.planning.map((recipe) => recipe.recipeId);
      const recipes = await Recipe.find().where('_id').in(ids).exec();

      res.status(200).json({ userPlanning, recipes });
    } else {
      throw new HttpException(404, 'planning not found');
    }
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};
