import mongoose from 'mongoose';
import { Rating } from '..';

const { Schema } = mongoose;

const userRatings = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Missing user id'],
  },
  ratings: {
    type: [
      {
        recipeId: {
          type: Schema.Types.ObjectId,
          ref: 'Recipe',
          required: [true, 'missing recipe id'],
        },
        rating: {
          type: Number,
          min: [1, 'rating value must be between 1 and 5'],
          max: [5, 'rating value must be between 1 and 5'],
          required: [true, 'missing rating value'],
        },
      },
    ],
    validate: [
      (ratings: Rating[]) => {
        return ratings.length === new Set(ratings).size;
      },
      'ratings must be unique',
    ],
    default: [],
  },
});

export const UserRatings = mongoose.model('UserRatings', userRatings);
