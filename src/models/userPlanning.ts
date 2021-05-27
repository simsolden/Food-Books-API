import mongoose from 'mongoose';
import { PlanningRecipe, Rating } from '..';
import HttpException from '../common/HttpException';
import { Recipe } from './recipe';

const { Schema } = mongoose;

const userPlanning = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Id de l'utilisateur manquant"],
  },
  planning: {
    type: [
      {
        recipeId: {
          type: Schema.Types.ObjectId,
          ref: 'Recipe',
          required: [true, 'Id de la recette manquant'],
        },
        date: {
          type: Date,
          min: [new Date(), 'La date est dépassée'],
          max: [
            new Date(+new Date() + 10 * 24 * 60 * 60 * 1000),
            'La date ne peut aller que jusque 6 jours dans le futur',
          ],
          required: [true, 'Date manquante'],
        },
      },
    ],
    validate: [
      (planning: PlanningRecipe[]) => {
        return planning.length < 100;
      },
      'Maximum 100 recettes dans un planning',
    ],
    default: [],
  },
});

export const UserPlanning = mongoose.model('UserPlanning', userPlanning);
