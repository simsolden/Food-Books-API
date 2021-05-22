import mongoose from 'mongoose';
import { Ingredient } from '..';
import HttpException from '../common/HttpException';
import { Category } from './category';
import { User } from './user';

const { Schema } = mongoose;

const recipe = new Schema(
  {
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
      default: 'easy',
    },
    cost: {
      type: String,
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
      default: ['default-recipe.jpg'],
    },
    type: {
      type: String,
      enum: ['Appetizer', 'Entry', 'Meal', 'Dessert', 'Drink', 'Other'],
      default: 'Meal',
    },
    categories: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Category',
          required: [true, 'missing category id'],
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
            enum: ['other', 'kg', 'g', 'l', 'cl', 'ml', 'c.c.', 'c.s.', 'sachet'],
            default: '',
          },
          name: {
            type: String,
            maxLength: [50, 'ingredient name must be between 2 and 50 characters'],
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
          maxLength: [510, 'recipe step must be between 5 and 255 characters'],
        },
      ],
      required: [true, 'missing recipe steps'],
      validate: [
        (prepSteps: string[]) => prepSteps.length > 0 && prepSteps.length <= 30,
        'There must be between 1 and 30 preparation steps',
      ],
    },
    speed: {
      type: String,
      enum: ['fast', 'medium', 'slow'],
      default: 'fast',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

recipe.statics.validateUserAndCategories = async (ownerId, categories) => {
  const owner: any = await User.findOne({ _id: ownerId });

  if (!owner) {
    throw new HttpException(401, 'User not found.');
  }

  for (const categoryId of categories) {
    if (!(await Category.findOne({ _id: categoryId }))) {
      throw new HttpException(404, 'Category not found.');
    }
  }
};

recipe.statics.validateRecipeId = async (recipeId) => {
  const recipe: any = await Recipe.findOne({ _id: recipeId });

  if (!recipe) {
    throw new HttpException(404, 'Recipe not found.');
  }
};

export const Recipe = mongoose.model('Recipe', recipe);
