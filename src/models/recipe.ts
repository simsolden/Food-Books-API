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
      required: [true, 'Titre de la recette manquant'],
      minLength: [3, 'Le titre doit faire entre 3 et 60 caractères maximum'],
      maxLength: [60, 'Le titre doit faire entre 3 et 60 caractères maximum'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Missing owner id'],
    },
    username: {
      type: String,
    },
    prepTime: {
      type: Number,
      required: [true, 'Temps de préparation manquant'],
      min: [1, 'Le temps de préparation doit être supérieur à 0'],
    },
    cookingTime: {
      type: Number,
      min: [0, 'Le temps de cuisson doit être suppérieur à zéro'],
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'difficult'],
      default: 'easy',
    },
    cost: {
      type: String,
      enum: ['low', 'medium', 'pricy'],
      default: 'low',
    },
    servings: {
      type: Number,
      required: [true, 'Nombre de portions manquant'],
      min: [1, 'Le nombre de portion doit être en 1 et 20'],
      max: [12, 'Le nombre de portion doit être en 1 et 20'],
    },
    grade: {
      type: Number,
      min: [1, 'La note doit être entre 1 et 5'],
      max: [5, 'La note doit être entre 1 et 5'],
      default: 5,
    },
    description: {
      type: String,
      required: [true, 'Description manquante'],
      minLength: [5, 'La description doit faire entre 5 et 510 caractères'],
      maxLength: [510, 'La description doit faire entre 5 et 510 caractères'],
    },
    pictures: {
      type: [String],
      validate: [(pictures: string[]) => pictures.length <= 5, 'Maximum 5 images'],
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
          required: [true, 'Id de la catégorie manquante'],
        },
      ],
      validate: [
        (categories: number[]) => {
          return categories.length === new Set(categories).size;
        },
        'Les catégories doivent être unique',
      ],
    },
    ingredients: {
      type: [
        {
          quantity: {
            type: Number,
            min: [0, 'La quantité doit être égale ou supérieure à zéro'],
          },
          measurement: {
            type: String,
            enum: ['other', 'kg', 'g', 'l', 'cl', 'ml', 'c.c.', 'c.s.', 'sachet'],
            default: 'other',
          },
          name: {
            type: String,
            maxLength: [50, 'ingredient name must be between 2 and 50 characters'],
            required: [true, 'missing ingredient name'],
          },
        },
      ],
      validate: [
        (ingredients: Ingredient[]) => ingredients.length > 0 && ingredients.length < 100,
        "Le nombre d'ingrédients doit être entre 1 et 100",
      ],
    },
    prepSteps: {
      type: [
        {
          type: String,
          minLength: [3, "L'étape doit faire entre entre 3 et 510 caractères"],
          maxLength: [510, "L'étape doit faire entre entre 3 et 510 caractères"],
        },
      ],
      required: [true, 'Étapes manquantes'],
      validate: [
        (prepSteps: string[]) => prepSteps.length > 0 && prepSteps.length <= 40,
        "Le nombre d'étapes doit être entre 1 et 40",
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

recipe.pre('save', async function (next) {
  const recipe: any = this;

  recipe.title = recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1);

  const user = await User.findOne({ _id: recipe.owner });
  // @ts-ignore
  recipe.username = user!.username;

  next();
});

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
