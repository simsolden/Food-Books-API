import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpException from '../common/HttpException';

const { Schema } = mongoose;

const user = new Schema({
  username: {
    type: String,
    required: [true, 'Missing username'],
    minLength: [3, 'recipe title must be between 3 and 40 characters'],
    unique: [true, 'Username already taken'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super-admin'],
    default: 'user',
  },
  firstname: {
    type: String,
    required: [true, 'Missing firstname'],
    minLength: [2, 'firstname must be between 2 and 40 characters'],
    maxLength: [40, 'firstname must be between 2 and 40 characters'],
  },
  lastname: {
    type: String,
    required: [true, 'Missing lastname'],
    minLength: [2, 'lastname must be between 2 and 40 characters'],
    maxLength: [40, 'lastname must be between 2 and 40 characters'],
  },
  birthdate: {
    type: Date,
    required: [true, 'missing birthdate'],
    min: [new Date(+new Date() - 120 * 365 * 24 * 60 * 60 * 1000), 'birthdate between 120 years ago and 14 years ago'],
    max: [new Date(+new Date() - 14 * 365 * 24 * 60 * 60 * 1000), 'birthdate between 120 years ago and 14 years ago'],
  },
  email: {
    type: String,
    required: [true, 'Missing email'],
    minLength: [5, 'email must be min 5 characters'],
    unique: [true, 'email already used'],
  },
  picturiUri: {
    type: String,
    default: 'default-avatar.jpg',
  },
  password: {
    type: String,
    required: [true, 'Missing password'],
    minLength: [6, 'email must be min 6 characters'],
  },
});

user.pre('save', async function (next) {
  const user: any = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
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
