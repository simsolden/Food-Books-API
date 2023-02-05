import { UserFavourites } from '../models/favourites';

export const createUserFavourites = async (req: any, res: any, next: any) => {
  const userFavourites = new UserFavourites({
    user: req.body.user,
  });

  req.body.favourites && userFavourites.set('favourites', req.body.favourites);

  try {
    await UserFavourites.create(userFavourites);

    res.status(200).json({ userFavourites });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: true, message: err.message });
    }
  }
};

export const findUserFavourites = async (req: any, res: any, next: any) => {
  try {
    let result;

    if (req.query) {
      result = await UserFavourites.find(req.query);
    } else {
      result = await UserFavourites.find();
    }

    res.status(200).json({ result });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: true, message: err.message });
    }
  }
};

export const findOneUserFavourites = async (req: any, res: any, next: any) => {
  try {
    const userId = req.params.userId;
    const result = await UserFavourites.findOne({ user: userId });

    res.status(200).json({ result });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: true, message: err.message });
    }
  }
};
