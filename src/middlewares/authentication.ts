import jwt from 'jsonwebtoken';
import HttpException from '../common/HttpException';
import { User } from '../models/user';

export const auth = async (req: any, res: any, next: any) => {
  try {
    const sentToken = req.headers.authorization?.replace('Bearer ', '');

    if (!sentToken) {
      throw new HttpException(401, 'Wrong or missing token');
    }

    const decoded = jwt.verify(sentToken, process.env.ACCESS_TOKEN_SECRET!);

    if (!decoded) {
      throw new HttpException(401, 'Wrong or missing token');
    }

    // @ts-ignore
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message || 'Please login.' });
  }
};
