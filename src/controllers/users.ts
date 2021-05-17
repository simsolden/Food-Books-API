import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
    await User.create(user);

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const login = async (req: any, res: any, next: any) => {
  const { email, password } = req.body;
  try {
    // @ts-ignore
    const user = await User.findByCredentials(email, password);
    // @ts-ignore
    await user.generateAuthToken();
    user.password = '';

    return res.json({ auth: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
