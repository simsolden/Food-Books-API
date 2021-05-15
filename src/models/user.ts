import mongoose from 'mongoose';
import { Ingredient } from '../index.d';

const { Schema } = mongoose;

const recipe = new Schema({
  username: {
    type: String,
    required: [true, 'Missing username'],
    minLength: [3, 'recipe title must be between 3 and 40 characters'],
    unique: [true, 'Username already taken'],
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
  email: {
    type: String,
    required: [true, 'Missing email'],
    minLength: [5, 'email must be min 5 characters'],
    unique: [true, 'email already used'],
  },
  password: {
    type: String,
    required: [true, 'Missing password'],
    minLength: [6, 'email must be min 6 characters'],
  },
  created_at: { type: Date, default: Date.now },
});
