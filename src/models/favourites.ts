import mongoose from 'mongoose';
import { Favourite } from '../index.d';

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

export const UserFavourites = mongoose.model('UserFavourites', userFavourites);
