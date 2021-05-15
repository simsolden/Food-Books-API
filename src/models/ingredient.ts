import mongoose from 'mongoose';
import { Ingredient } from '../index.d';

const { Schema } = mongoose;

const recipe = new Schema({
  title: {
    type: String,
    required: [true, 'Missing recipe title'],
    minLength: [3, 'recipe title must be between 3 and 40 characters'],
    maxLength: [40, 'recipe title must be between 3 and 40 characters'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Missing owner id'],
  },
  prepTime: {
    type: Number,
    required: [true, 'Missing preparation time'],
    min: [1, 'recipe preparation time must be between strictly positive '],
  },
  cookingTime: {
    type: Number,
    min: [1, 'recipe cookin time must be between strictly positive '],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'difficult'],
    required: [true, 'missing difficulty'],
    default: 'easy',
  },
  cost: {
    type: String,
    required: [true, 'missing cost'],
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  servings: {
    type: Number,
    required: [true, 'Missing servings'],
    min: [1, 'recipe servings must be between 1 and 12'],
    max: [12, 'recipe servings must be between 1 and 12'],
  },
  grade: {
    type: Number,
    min: [1, 'recipe grade must be between strictly positive '],
    max: [5, 'recipe grade time must be between strictly positive '],
    required: [true, 'missing grade'],
    default: 5,
  },
  description: {
    type: String,
    required: [true, 'Missing recipe description'],
    minLength: [5, 'recipe description must be between 5 and 255 characters'],
    maxLength: [255, 'recipe description must be between 5 and 255 characters'],
  },
  pictures: {
    type: [String],
    validate: [(pictures: string[]) => pictures.length <= 5, 'Maximum 5 pictures'],
    required: [true, 'missing recipe pictures'],
    default: [],
  },
  type: {
    type: String,
    required: [true, 'missing type'],
    enum: ['Appetizer', 'Entry', 'Meal', 'Dessert', 'Drink', 'Other'],
    default: 'Meal',
  },
  categories: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require,
      },
    ],
    validate: [
      (categories: number[]) => {
        return categories.length === new Set(categories).size;
      },
      'categories must be unique',
    ],
  },
  ingredients: {
    type: [
      {
        quantity: {
          type: Number,
          min: [1, 'quantity must be strictly positive'],
          required: [true, 'missing ingredient quantity'],
        },
        measurement: {
          type: String,
          enum: ['', 'kg', 'g', 'l', 'cl', 'ml', 'c.c.', 'c.s.', 'sachet'],
          default: '',
        },
        name: {
          type: String,
          minLength: [2, 'ingredient name must be between 2 and 25 characters'],
          maxLength: [25, 'ingredient name must be between 2 and 25 characters'],
          required: [true, 'missing ingredient name'],
        },
      },
    ],
    validate: [
      (ingredients: Ingredient[]) => ingredients.length > 0 && ingredients.length < 150,
      'Number of ingredients must be between 1 and 150',
    ],
  },
  prepSteps: {
    type: [
      {
        type: String,
        minLenght: [5, 'recipe step must be between 5 and 255 characters'],
        maxLength: [255, 'recipe step must be between 5 and 255 characters'],
      },
    ],
    required: [true, 'missing recipe steps'],
    validate: [
      (prepSteps: string[]) => prepSteps.length > 0 && prepSteps.length <= 30,
      'There must be between 1 and 30 preparation steps',
    ],
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  created_at: { type: Date, default: Date.now },
});
