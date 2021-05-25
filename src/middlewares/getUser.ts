import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export const getUser = async (req: any, res: any, next: any) => {
  try {
    const sentToken = req.headers.authorization?.replace('Bearer ', '');

    if (sentToken) {
      const decoded = jwt.verify(sentToken, process.env.ACCESS_TOKEN_SECRET!);

      if (decoded) {
        // @ts-ignore
        const user = await User.findOne({ _id: decoded.userId });
        if (user) {
          req.user = user;
          return next();
        }
      }
    }

    req.user = null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
