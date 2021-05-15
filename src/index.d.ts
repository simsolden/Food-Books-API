export enum Difficulty {
  Easy = 1,
  Medium,
  Difficult,
}

export enum Cost {
  Low = 1,
  Medium,
  High,
}

export enum RecipeType {
  Appetizer = 1,
  Entry,
  Meal,
  Dessert,
  Drink,
  Other,
}

export enum Measurement {
  None,
  Kilo,
  Gram,
  Liter,
  Centiliter,
  Mililiter,
  TeaSpoon,
  TableSpoon,
  Pack,
}

export interface User {
  id?: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface Ingredient {
  title: string;
  measurement: ['', 'kg', 'g', 'l', 'cl', 'ml', 'c.c.', 'c.s.', 'sachet'];
  quantity: number;
}

export interface Category {
  _id?: number;
  title: string;
  description: string;
  pictureUri: string;
}

export interface Recipe {
  _id?: string;
  owner: number;
  title: string;
  prepTime: number;
  cookingTime: number;
  difficulty: ['easy', 'medium', 'difficult'];
  cost: ['low', 'medium', 'high'];
  servings: number;
  grade: number;
  description: string;
  pictures: string[];
  type: ['Appetizer', 'Entry', 'Meal', 'Dessert', 'Drink', 'Other'];
  categories: number[];
  ingredients: Ingredient[];
  prepSteps: string[];
  isPrivate: boolean;
}
