import { UserRatings } from '../models/userRatings';

export const createUserRatings = async (req: any, res: any, next: any) => {
  const userRatings = new UserRatings({
    user: req.body.user,
  });

  req.body.ratings && userRatings.set('ratings', req.body.ratings);

  try {
    const result = await UserRatings.create(userRatings);

    res.status(200).json({ userRatings });
  } catch (err) {
if (err instanceof Error) {
      res.status(500).json({ error: true, message: err.message });
    }  }
};

export const findUserRatings = async (req: any, res: any, next: any) => {
  try {
    let result;

    if (req.query) {
      result = await UserRatings.find(req.query);
    } else {
      result = await UserRatings.find();
    }

    res.status(200).json({ result });
  } catch (err) {
if (err instanceof Error) {
      res.status(500).json({ error: true, message: err.message });
    }  }
};

export const findOneUserRatings = async (req: any, res: any, next: any) => {
  try {
    const userId = req.params.userId;
    const result = await UserRatings.findOne({ user: userId });

    res.status(200).json({ result });
  } catch (err) {
if (err instanceof Error) {
      res.status(500).json({ error: true, message: err.message });
    }  }
};
