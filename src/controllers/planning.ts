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

export const findUserPlanning = async (req: any, res: any, next: any) => {
  try {
    let result;

    if (req.query) {
      result = await UserPlanning.find(req.query);
    } else {
      result = await UserPlanning.find();
    }

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const findOneUserPlanning = async (req: any, res: any, next: any) => {
  try {
    const userId = req.params.userId;
    const result = await UserPlanning.findOne({ user: userId });

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
