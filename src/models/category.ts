import mongoose from 'mongoose';

const { Schema } = mongoose;

const category = new Schema({
  title: {
    type: String,
    unique: [true, 'category title must be unique'],
    required: [true, 'Missing category title'],
    minLength: [3, 'category title must be between 3 and 40 characters'],
    maxLength: [40, 'category title must be between 3 and 40 characters'],
  },
  description: {
    type: String,
    required: [true, 'Missing category description'],
    minLength: [10, 'category description must be between 10 and 1024 characters'],
    maxLength: [1024, 'category description must be between 10 and 1024 characters'],
  },
  descriptionSource: {
    type: String,
    maxLength: [1024, 'category description must be less than 1024 characters'],
  },
  pictureUri: {
    type: String,
    unique: [true, 'category pictureUri must be unique'],
    required: [true, 'Missing category picture'],
    maxLength: [255, 'category title must be lower than 255 characters'],
  },
});

export const Category = mongoose.model('Category', category);
