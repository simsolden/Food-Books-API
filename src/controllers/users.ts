import bcrypt from 'bcrypt';
import safe from 'safe-regex';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

import HttpException from '../common/HttpException';
import { User } from '../models/user';
import { Recipe } from '../models/recipe';

export const createUser = async (req: any, res: any, next: any) => {
  const user = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    birthdate: req.body.birthdate,
    password: req.body.password,
  });

  req.body.role && user.set('role', req.body.role);
  req.body.pictureUri && user.set('picturiUri', req.body.picturiUri);

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'jeromy73@ethereal.email',
      pass: '4Mm33ApMEFGDMYACW2',
    },
  });

  try {
    const userResponse = await User.create(user);
    // @ts-ignore
    userResponse._doc.password = '';
    // @ts-ignore
    const confirmationToken = jwt.sign({ userId: user._id.toString() }, process.env.EMAIL_TOKEN_SECRET!);
    const url = `${process.env.WEBSITE_URL}/confirmation/${confirmationToken}`;

    let info = await transporter.sendMail({
      from: '"FoodBooks" <info@foodbooks.fr>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Email de confirmation Foodbooks.fr', // Subject line
      html: `<b>Cliquez sur ce lien pour confirmer votre inscription FoodBooks : <a target="_blank" href="${url}">${process.env.WEBSITE_URL}/confirmation</a></b>`, // html body
    });

    // @ts-ignore
    res.status(200).json({ user: { ...userResponse._doc } });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: true, message: err.message });
    }
  }
};

export const verifyAddress = async (req: any, res: any, next: any) => {
  try {
    const result = await User.updateOne({ _id: req.user._id }, { emailVerified: true });
    res.json({ updated: result.nModified });
  } catch (err) {
    if (err instanceof Error) {
      res.status(err.statusCode || 500).json({ message: err.message });
    }
  }
};

export const login = async (req: any, res: any, next: any) => {
  const { email, password } = req.body;
  try {
    // @ts-ignore
    const user = await User.findByCredentials(email, password);

    if (!user.emailVerified) {
      throw new HttpException(403, 'Compte non vérifié. ');
    }
    user.password = '';
    // @ts-ignore
    const token = await user.generateAuthToken();

    req.brute.reset(function () {});

    res.json({ user, token });
  } catch (err) {
    if (err instanceof Error) {
      res.status(err.statusCode || 500).json({ message: err.message });
    }
  }
};

export const autoLogin = async (req: any, res: any, next: any) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    if (err instanceof Error) {
      res.status(err.statusCode || 500).json({ message: err.message });
    }
  }
};

export const findUserRecipes = async (req: any, res: any, next: any) => {
  try {
    let result;
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
          .equals(req.user._id)
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
          .equals(req.user._id)
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
          .equals(req.user._id)
          .where('categories')
          .in(categories)
          .sort(sort)
          .limit(req.limit)
          .skip(req.startIndex);
      } else {
        result = await Recipe.find(req.query)
          .where('owner')
          .equals(req.user._id)
          .sort(sort)
          .limit(req.limit)
          .skip(req.startIndex);
      }
    }

    const response: any = { result };

    if (res.pagination) {
      response.pagination = res.pagination;
    }

    res.status(200).json(response);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: true, message: err.message });
    }
  }
};

// export const findOneUser = async (req: any, res: any, next: any) => {
//   try {
//     const userId = req.params.userId;
//     const result = await User.findOne({ _id: userId });

//     res.status(200).json({ result });
//   } catch (err) {
// // if (err instanceof Error) {
//       // res.status(500).json({ error: true, message: err.message });
//     //   }
// };

export const updateUser = async (req: any, res: any, next: any) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  try {
    const userId = req.params.userId;

    if (userId === req.user._id) {
      const result = await User.findOneAndUpdate({ _id: userId }, req.body, { new: true });
      res.status(200).json({ result });
    }

    throw new HttpException(401, 'unauthorized');
  } catch (err) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({ error: true, message: err.message });
    }
  }
};
