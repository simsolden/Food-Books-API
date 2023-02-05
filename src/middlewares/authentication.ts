import jwt from 'jsonwebtoken';
import HttpException from '../common/HttpException';
import { User } from '../models/user';

export const auth = async (req: any, res: any, next: any) => {
  try {
    // Fetch token in headers
    const sentToken = req.headers.authorization?.replace('Bearer ', '');

    if (!sentToken) {
      throw new HttpException(401, 'Wrong or missing token');
    }

    let decoded;

    if (req.url === '/confirmation') {
      decoded = jwt.verify(sentToken, process.env.EMAIL_TOKEN_SECRET!);
    } else {
      // Verify token validity abd retrieve its decoded payload
      decoded = jwt.verify(sentToken, process.env.ACCESS_TOKEN_SECRET!);
    }

    if (!decoded) {
      throw new HttpException(401, 'Wrong or missing token');
    }

    // @ts-ignore Fetch user via token payload (decoded.userId)
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new HttpException(401, 'User not found');
    }
    // Attach it to the request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  }
};
