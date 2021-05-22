import { User } from '../models/user';
import bcrypt from 'bcrypt';
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

  try {
    const userResponse = await User.create(user);
    // @ts-ignore
    userResponse._doc.password = '';
    // @ts-ignore
    const token = await user.generateAuthToken();
    // @ts-ignore
    res.status(200).json({ user: { ...userResponse._doc }, token });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const login = async (req: any, res: any, next: any) => {
  const { email, password } = req.body;
  try {
    // @ts-ignore
    const user = await User.findByCredentials(email, password);
    user.password = '';
    // @ts-ignore
    const token = await user.generateAuthToken();

    return res.json({ user, token });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const findUsers = async (req: any, res: any, next: any) => {
  try {
    let result;

    if (req.query) {
      result = await User.find(req.query);
    } else {
      result = await User.find();
    }

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const findUserRecipe = async (req: any, res: any, next: any) => {
  try {
    let result;

    if (req.query.title) {
      const search = req.query.title;
      const regex = new RegExp(`.*${search}.*`, 'i');
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
          .sort('-_id');
      } else {
        result = await Recipe.find(req.query)
          .where('owner')
          .equals(req.user._id)
          .where('title')
          .regex(regex)
          .sort('-_id');
      }
      //To be able to use the rest of the query as a document finder, remove title
    } else {
      if (req.query.categories) {
        const categories = req.query.categories;
        delete req.query.categories;

        result = await Recipe.find(req.query)
          .where('owner')
          .equals(req.user._id)
          .where('categories')
          .in(categories)
          .sort('-_id');
      } else {
        result = await Recipe.find(req.query).where('owner').equals(req.user._id).sort('-_id');
      }
    }

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const findOneUser = async (req: any, res: any, next: any) => {
  try {
    const userId = req.params.userId;
    const result = await User.findOne({ _id: userId });

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const updateUser = async (req: any, res: any, next: any) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  try {
    const userId = req.params.userId;
    const result = await User.findOneAndUpdate({ _id: userId }, req.body, { new: true });

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
