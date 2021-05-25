import { ObjectId } from 'mongodb';
import { Recipe } from '../../models/recipe';

export const pagination = async (req: any, res: any, next: any) => {
  const LIMIT = 8;
  const user = req.user ? req.user : new ObjectId(1);
  const page = +req.query.page;
  const sort = req.query.sort;

  res.pagination = {
    currentPage: page,
  };
  res.pagination.currentPage = page;

  delete req.query.page;
  delete req.query.sort;

  const startIndex = (page - 1) * LIMIT;
  const endIndex = page * LIMIT;

  let resultsCount = 0;

  if (req.query.title) {
    const search = req.query.title;
    const regex = new RegExp(`.*${search}.*`, 'i');
    //To be able to use the rest of the query as a document finder, remove title
    delete req.query.title;

    if (req.query.categories) {
      const categories = req.query.categories;
      delete req.query.categories;

      resultsCount = await Recipe.countDocuments(req.query)
        .where('owner')
        .ne(user)
        .where('isPrivate')
        .equals(false)
        .where('isDraft')
        .equals(false)
        .where('title')
        .regex(regex)
        .where('categories')
        .in(categories)
        .sort('-_id');

      req.query.categories = categories;
    } else {
      resultsCount = await Recipe.countDocuments(req.query)
        .where('owner')
        .ne(user)
        .where('isPrivate')
        .equals(false)
        .where('isDraft')
        .equals(false)
        .where('title')
        .regex(regex)
        .sort('-_id');
    }

    req.query.title = search;
  } else {
    if (req.query.categories) {
      const categories = req.query.categories;
      delete req.query.categories;

      resultsCount = await Recipe.countDocuments(req.query)
        .where('owner')
        .ne(user)
        .where('isDraft')
        .equals(false)
        .where('isPrivate')
        .equals(false)
        .where('categories')
        .in(categories)
        .sort('-_id');

      req.query.categories = categories;
    } else {
      resultsCount = await Recipe.countDocuments(req.query)
        .where('owner')
        .ne(user)
        .where('isDraft')
        .equals(false)
        .where('isPrivate')
        .equals(false)
        .sort('-_id');
    }
  }

  if (endIndex < resultsCount) {
    res.pagination.next = {
      page: page + 1,
      lastPage: Math.ceil(resultsCount / LIMIT),
    };
  }

  if (startIndex > 0) {
    res.pagination.previous = {
      page: page - 1,
      lastPage: Math.ceil(resultsCount / LIMIT),
    };
  }

  req.query.sort = sort;
  req.limit = LIMIT;
  req.startIndex = startIndex;
  next();
};
