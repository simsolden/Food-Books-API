import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpException from '../common/HttpException';
import { UserPlanning } from './userPlanning';

const { Schema } = mongoose;

const user = new Schema({
  username: {
    type: String,
    required: [true, "Nom d'utilisateur manquant."],
    minLength: [3, 'Le pseudo doit faire minimum 3 caractères'],
    unique: [true, "Nom d'utilisateur déjà pris."],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super-admin'],
    default: 'user',
  },
  firstname: {
    type: String,
    required: [true, 'Prénom manquant'],
    minLength: [2, 'Prénom entre 2 et 40 caractères maximum'],
    maxLength: [40, 'Prénom entre 2 et 40 caractères maximum'],
  },
  lastname: {
    type: String,
    required: [true, 'Nom de famille manquant'],
    minLength: [2, 'Nom de famille entre 2 et 40 caractères maximum'],
    maxLength: [40, 'Nom de famille entre 2 et 40 caractères maximum'],
  },
  birthdate: {
    type: Date,
    required: [true, 'Date de naissance manquant'],
    min: [
      new Date(+new Date() - 120 * 365 * 24 * 60 * 60 * 1000),
      'Date de naissance entre 120 et 14 ans dans le passé',
    ],
    max: [new Date(+new Date() - 8 * 365 * 24 * 60 * 60 * 1000), 'Date de naissance entre 120 et 14 ans dans le passé'],
  },
  email: {
    type: String,
    required: [true, 'Email manquant'],
    minLength: [5, "L'email doit faire minimum 5 caractères"],
    unique: [true, 'Email déjà utilisé'],
  },
  picturiUri: {
    type: String,
    default: 'default-avatar.jpg',
  },
  password: {
    type: String,
    required: [true, 'Mot de passe manquant'],
    minLength: [6, 'Le mot de passe doit faire minimum 6 caractères'],
  },
});

user.pre('save', async function (next) {
  const user: any = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  await UserPlanning.create({ user: user._id });
  next();
});

user.methods.generateAuthToken = async function () {
  const user: any = this;

  const token = jwt.sign({ userId: user._id.toString() }, process.env.ACCESS_TOKEN_SECRET!);

  return token;
};

user.statics.findByCredentials = async (email, password) => {
  const user: any = await User.findOne({ email });
  if (!user) {
    throw new HttpException(401, 'Unable to login.');
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new HttpException(401, 'Unable to login.');
  }

  return user;
};

export const User = mongoose.model('User', user);
