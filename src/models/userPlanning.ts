import mongoose from 'mongoose';
import { PlanningRecipe, Rating } from '..';
import HttpException from '../common/HttpException';
import { Recipe } from './recipe';

const { Schema } = mongoose;

const userPlanning = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Missing user id'],
  },
  planning: {
    type: [
      {
        recipeId: {
          type: Schema.Types.ObjectId,
          ref: 'Recipe',
          required: [true, 'missing recipe id'],
        },
        date: {
          type: Date,
          min: [new Date(), 'birthdate between now and 10 days in the future'],
          max: [new Date(+new Date() + 10 * 24 * 60 * 60 * 1000), 'birthdate between now and 10 days in the future'],
          required: [true, 'missing date'],
        },
      },
    ],
    validate: [
      (planning: PlanningRecipe[]) => {
        return planning.length < 100 && planning.length === new Set(planning).size;
      },
      'planning recipes must be unique and less than 100 recipes',
    ],
    default: [],
  },
});

export const UserPlanning = mongoose.model('UserPlanning', userPlanning);
