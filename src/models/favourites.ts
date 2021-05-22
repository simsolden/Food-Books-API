import mongoose from 'mongoose';
import HttpException from '../common/HttpException';
import { Favourite } from '../index.d';
import { Recipe } from './recipe';

const { Schema } = mongoose;

const userFavourites = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Missing user id'],
  },
  favourites: {
    type: [
      {
        recipeId: {
          type: Schema.Types.ObjectId,
          ref: 'Recipe',
          required: [true, 'missing recipe id'],
        },
        created_at: { type: Date, default: Date.now },
      },
    ],
    validate: [
      (favourites: Favourite[]) => {
        return favourites.length === new Set(favourites).size;
      },
      'favourites must be unique',
    ],
    default: [],
  },
});

userFavourites.statics.validateRecipeId = async (recipeId) => {
  const recipe: any = await Recipe.findOne({ _id: recipeId });

  if (!recipe) {
    throw new HttpException(404, 'Recipe not found.');
  }
};

export const UserFavourites = mongoose.model('UserFavourites', userFavourites);
