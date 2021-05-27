import HttpException from '../../common/HttpException';
import { Recipe } from '../../models/recipe';
import { User } from '../../models/user';

export const verifyPicture = async (req: any, res: any, next: any) => {
  const { oldPicture } = req.body;
  const user = new User(req.user);

  try {
    if (oldPicture !== 'default-recipe.jpg') {
      const recipe = await Recipe.findOne({ pictures: oldPicture }).where('owner').equals(user._id);

      if (!recipe) {
        throw new HttpException(401, 'unauthorized');
      }

      req.shouldDelete = true;
    } else {
      req.shouldDelete = false;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
